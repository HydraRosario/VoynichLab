// ============================================================
// DataSetCreator - Tauri Bridge
// All backend communication via Tauri 2 invoke()
// ============================================================

const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event || {};

/**
 * Wraps invoke with consistent error handling.
 * Tauri 2: JS camelCase args map to Rust snake_case.
 */
async function call(command, args = {}) {
  try {
    return await invoke(command, args);
  } catch (err) {
    console.error(`[tauri-bridge] ${command} failed:`, err);
    throw err;
  }
}

export const api = {
  syncDefaultManuscriptPages() {
    return call('sync_default_manuscript_pages');
  },

  listImages() {
    return call('list_images');
  },

  getImage(id) {
    return call('get_image', { id });
  },

  getImageBase64(id) {
    return call('get_image_base64', { id });
  },

  // Regions
  createRegion(imageId, geometryJson, orderIndex) {
    return call('create_region', {
      imageId,
      geometryJson,
      orderIndex: orderIndex || 0
    });
  },

  updateRegion(id, updates) {
    return call('update_region', {
      id: Number(id),
      geometryJson: updates.geometryJson ?? updates.geometry_json,
      orderIndex: updates.orderIndex ?? updates.order_index
    });
  },

  deleteRegion(id) {
    return call('delete_region', { id: Number(id) });
  },

  deleteRegionsBatch(ids) {
    return call('delete_regions_batch', {
      ids: (ids || []).map((id) => Number(id))
    });
  },

  listRegions(imageId) {
    return call('list_regions', { imageId });
  },

  syncAtomForRegion(regionId, family, structuralConfig) {
    return call('sync_atom_for_region', {
      regionId: Number(regionId),
      family: family || null,
      structuralConfig: structuralConfig || null
    });
  },

  createAtomStrokesBatch(imageId, strokes) {
    return call('create_atom_strokes_batch', {
      imageId: Number(imageId),
      strokes: strokes || []
    });
  },

  recalculateMolecules(imageId) {
    return call('recalculate_molecules', { imageId });
  },

  setMoleculeGapOverride(imageId, leftParticleIndex, rightParticleIndex, decision) {
    return call('set_molecule_gap_override', {
      imageId: Number(imageId),
      leftParticleIndex: Number(leftParticleIndex),
      rightParticleIndex: Number(rightParticleIndex),
      decision
    });
  },

  clearMoleculeGapOverride(imageId, leftParticleIndex, rightParticleIndex) {
    return call('clear_molecule_gap_override', {
      imageId: Number(imageId),
      leftParticleIndex: Number(leftParticleIndex),
      rightParticleIndex: Number(rightParticleIndex)
    });
  },

  setMoleculeGapOverridesBatch(imageId, overrides) {
    return call('set_molecule_gap_overrides_batch', {
      imageId: Number(imageId),
      overrides: (overrides || []).map((override) => ({
        leftParticleIndex: Number(override.leftParticleIndex ?? override.left_particle_index),
        rightParticleIndex: Number(override.rightParticleIndex ?? override.right_particle_index),
        decision: override.decision
      }))
    });
  },

  setParticleRowOverride(imageId, particleIndex, rowIndex) {
    return call('set_particle_row_override', {
      imageId: Number(imageId),
      particleIndex: Number(particleIndex),
      rowIndex: Number(rowIndex)
    });
  },

  clearParticleRowOverride(imageId, particleIndex) {
    return call('clear_particle_row_override', {
      imageId: Number(imageId),
      particleIndex: Number(particleIndex)
    });
  },

  setParticleRowOverridesBatch(imageId, overrides) {
    return call('set_particle_row_overrides_batch', {
      imageId: Number(imageId),
      overrides: (overrides || []).map((override) => {
        const rawRowIndex = override.rowIndex ?? override.row_index;
        return {
          particleIndex: Number(override.particleIndex ?? override.particle_index),
          rowIndex: rawRowIndex === null || rawRowIndex === undefined ? null : Number(rawRowIndex)
        };
      })
    });
  },

  adjustParticleRowGuide(imageId, rowIndex, deltaY, edge = 'all') {
    return call('adjust_particle_row_guide', {
      imageId: Number(imageId),
      rowIndex: Number(rowIndex),
      deltaY: Number(deltaY),
      edge
    });
  },

  setParticleRowGuides(imageId, guides) {
    return call('set_particle_row_guides', {
      imageId: Number(imageId),
      guides: (guides || []).map((guide) => ({
        rowIndex: Number(guide.rowIndex ?? guide.row_index),
        topY: Number(guide.topY ?? guide.top_y),
        y: Number(guide.y),
        bottomY: Number(guide.bottomY ?? guide.bottom_y)
      }))
    });
  },

  setParticleAtomOrder(imageId, particleId, atomIds) {
    return call('set_particle_atom_order', {
      imageId: Number(imageId),
      particleId,
      atomIds: (atomIds || []).map((atomId) => Number(atomId))
    });
  },

  setMoleculeParticleOrder(imageId, moleculeId, particleIds) {
    return call('set_molecule_particle_order', {
      imageId: Number(imageId),
      moleculeId,
      particleIds: (particleIds || []).map((particleId) => String(particleId))
    });
  },

  setOrderDraftsBatch(imageId, particleAtomOrders = [], moleculeParticleOrders = []) {
    return call('set_order_drafts_batch', {
      imageId: Number(imageId),
      particleAtomOrders: particleAtomOrders.map((draft) => ({
        particleId: String(draft.particleId ?? draft.particle_id ?? ''),
        atomIds: (draft.atomIds ?? draft.atom_ids ?? []).map((atomId) => Number(atomId))
      })),
      moleculeParticleOrders: moleculeParticleOrders.map((draft) => ({
        moleculeId: String(draft.moleculeId ?? draft.molecule_id ?? ''),
        particleIds: (draft.particleIds ?? draft.particle_ids ?? []).map((particleId) => String(particleId))
      }))
    });
  },

  setParticleMergePattern(imageId, particleIdA, particleIdB) {
    return call('set_particle_merge_pattern', {
      imageId: Number(imageId),
      particleIdA,
      particleIdB
    });
  },

  clearLatestParticleMergePattern(imageId) {
    return call('clear_latest_particle_merge_pattern', {
      imageId: Number(imageId)
    });
  },

  listenMoleculesUpdated(callback) {
    if (typeof listen !== 'function') return Promise.resolve(() => {});
    return listen('molecules-updated', (event) => callback(event.payload));
  },

  // Labels
  createLabel(regionId, labelType, value) {
    return call('create_label', {
      regionId: Number(regionId),
      labelType: labelType || 'tag',
      value
    });
  },

  updateLabel(id, updates) {
    return call('update_label', { id: Number(id), ...updates });
  },

  deleteLabel(id) {
    return call('delete_label', { id: Number(id) });
  },

  listLabels(regionId) {
    return call('list_labels', { regionId: Number(regionId) });
  }
};

export default api;
