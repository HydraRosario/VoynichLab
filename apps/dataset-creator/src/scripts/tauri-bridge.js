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

  syncParticleForRegion(regionId, family, structuralConfig) {
    return call('sync_particle_for_region', {
      regionId: Number(regionId),
      family: family || null,
      structuralConfig: structuralConfig || null
    });
  },

  createParticleStrokesBatch(imageId, strokes) {
    return call('create_particle_strokes_batch', {
      imageId: Number(imageId),
      strokes: strokes || []
    });
  },

  recalculateMolecules(imageId) {
    return call('recalculate_molecules', { imageId });
  },

  setMoleculeGapOverride(imageId, leftAtomIndex, rightAtomIndex, decision) {
    return call('set_molecule_gap_override', {
      imageId: Number(imageId),
      leftAtomIndex: Number(leftAtomIndex),
      rightAtomIndex: Number(rightAtomIndex),
      decision
    });
  },

  clearMoleculeGapOverride(imageId, leftAtomIndex, rightAtomIndex) {
    return call('clear_molecule_gap_override', {
      imageId: Number(imageId),
      leftAtomIndex: Number(leftAtomIndex),
      rightAtomIndex: Number(rightAtomIndex)
    });
  },

  setMoleculeGapOverridesBatch(imageId, overrides) {
    return call('set_molecule_gap_overrides_batch', {
      imageId: Number(imageId),
      overrides: (overrides || []).map((override) => ({
        leftAtomIndex: Number(override.leftAtomIndex ?? override.left_atom_index),
        rightAtomIndex: Number(override.rightAtomIndex ?? override.right_atom_index),
        decision: override.decision
      }))
    });
  },

  setAtomRowOverride(imageId, atomIndex, rowIndex) {
    return call('set_atom_row_override', {
      imageId: Number(imageId),
      atomIndex: Number(atomIndex),
      rowIndex: Number(rowIndex)
    });
  },

  clearAtomRowOverride(imageId, atomIndex) {
    return call('clear_atom_row_override', {
      imageId: Number(imageId),
      atomIndex: Number(atomIndex)
    });
  },

  setAtomRowOverridesBatch(imageId, overrides) {
    return call('set_atom_row_overrides_batch', {
      imageId: Number(imageId),
      overrides: (overrides || []).map((override) => {
        const rawRowIndex = override.rowIndex ?? override.row_index;
        return {
          atomIndex: Number(override.atomIndex ?? override.atom_index),
          atomKey: override.atomKey ?? override.atom_key ?? null,
          rowIndex: rawRowIndex === null || rawRowIndex === undefined ? null : Number(rawRowIndex)
        };
      })
    });
  },

  adjustAtomRowGuide(imageId, rowIndex, deltaY, edge = 'all') {
    return call('adjust_atom_row_guide', {
      imageId: Number(imageId),
      rowIndex: Number(rowIndex),
      deltaY: Number(deltaY),
      edge
    });
  },

  setAtomRowGuides(imageId, guides) {
    return call('set_atom_row_guides', {
      imageId: Number(imageId),
      guides: (guides || []).map((guide) => ({
        rowIndex: Number(guide.rowIndex ?? guide.row_index),
        topY: Number(guide.topY ?? guide.top_y),
        y: Number(guide.y),
        bottomY: Number(guide.bottomY ?? guide.bottom_y)
      }))
    });
  },

  setAtomParticleOrder(imageId, atomId, particleIds) {
    return call('set_atom_particle_order', {
      imageId: Number(imageId),
      atomId,
      particleIds: (particleIds || []).map((particleId) => Number(particleId))
    });
  },

  setMoleculeAtomOrder(imageId, moleculeId, atomIds) {
    return call('set_molecule_atom_order', {
      imageId: Number(imageId),
      moleculeId,
      atomIds: (atomIds || []).map((atomId) => String(atomId))
    });
  },

  setOrderDraftsBatch(imageId, atomParticleOrders = [], moleculeAtomOrders = []) {
    return call('set_order_drafts_batch', {
      imageId: Number(imageId),
      atomParticleOrders: atomParticleOrders.map((draft) => ({
        atomId: String(draft.atomId ?? draft.atom_id ?? ''),
        particleIds: (draft.particleIds ?? draft.particle_ids ?? []).map((particleId) => Number(particleId))
      })),
      moleculeAtomOrders: moleculeAtomOrders.map((draft) => ({
        moleculeId: String(draft.moleculeId ?? draft.molecule_id ?? ''),
        atomIds: (draft.atomIds ?? draft.atom_ids ?? []).map((atomId) => String(atomId))
      }))
    });
  },

  setAtomMergePattern(imageId, atomIdA, atomIdB) {
    return call('set_atom_merge_pattern', {
      imageId: Number(imageId),
      atomIdA,
      atomIdB
    });
  },

  clearLatestAtomMergePattern(imageId) {
    return call('clear_latest_atom_merge_pattern', {
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
