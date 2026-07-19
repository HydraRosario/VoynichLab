use serde::{Deserialize, Serialize};

// =============================================================================
// Output models (returned from DB queries)
// =============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Image {
    pub id: i64,
    pub name: String,
    pub source_path: String,
    pub width: Option<i64>,
    pub height: Option<i64>,
    pub metadata_json: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Region {
    pub id: i64,
    pub image_id: i64,
    pub geometry_json: String,
    pub order_index: Option<i64>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Label {
    pub id: i64,
    pub region_id: i64,
    pub label_type: String,
    pub value: String,
    pub created_at: String,
    pub updated_at: String,
}

// =============================================================================
// Input models (used for create / update operations)
// =============================================================================

#[derive(Debug, Clone, Deserialize)]
pub struct CreateImage {
    pub name: String,
    pub source_path: String,
    pub width: Option<i64>,
    pub height: Option<i64>,
    pub metadata_json: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateRegion {
    pub image_id: i64,
    pub geometry_json: String,
    pub order_index: Option<i64>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateRegion {
    pub geometry_json: Option<String>,
    pub order_index: Option<i64>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateLabel {
    pub region_id: i64,
    pub label_type: String,
    pub value: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BatchParticleLabelInput {
    pub label_type: String,
    pub value: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct BatchParticleStrokeInput {
    pub geometry_json: String,
    pub order_index: Option<i64>,
    pub labels: Vec<BatchParticleLabelInput>,
    pub family: Option<String>,
    pub structural_config: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateLabel {
    pub label_type: Option<String>,
    pub value: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Particle {
    pub id: i64,
    pub region_id: i64,
    pub image_id: i64,
    pub family: String,
    pub color: Option<String>,
    pub points_json: String,
    pub anchor_x: f64,
    pub anchor_y: f64,
    pub bounds_x: f64,
    pub bounds_y: f64,
    pub bounds_w: f64,
    pub bounds_h: f64,
    pub length: f64,
    pub angle: f64,
    pub points_count: i64,
    pub visual_variant: Option<String>,
    pub structural_config: Option<String>,
    pub molecule_id: Option<String>,
    pub atom_id: Option<String>,
    pub particle_order: Option<i64>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Molecule {
    pub id: i64,
    pub molecule_id: String,
    pub image_id: i64,
    pub particle_count: i64,
    pub atom_count: i64,
    pub centroid_x: f64,
    pub centroid_y: f64,
    pub bounds_x: f64,
    pub bounds_y: f64,
    pub bounds_w: f64,
    pub bounds_h: f64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Atom {
    pub id: i64,
    pub atom_id: String,
    pub molecule_id: String,
    pub image_id: i64,
    pub particle_count: i64,
    pub atom_order: i64,
    pub source_index: i64,
    pub centroid_x: f64,
    pub centroid_y: f64,
    pub bounds_x: f64,
    pub bounds_y: f64,
    pub bounds_w: f64,
    pub bounds_h: f64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClusterExplanation {
    pub micro_threshold: f64,
    pub macro_threshold: f64,
    pub training_particle_count: i64,
    pub gap_count: i64,
    pub gap_centers: Vec<f64>,
    pub links: Vec<ClusterLink>,
    pub molecule_gaps: Vec<MoleculeGapAudit>,
    pub atom_rows: Vec<AtomRowAudit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClusterLink {
    pub stage: String,
    pub particle_id_a: i64,
    pub particle_id_b: i64,
    pub accepted: bool,
    pub reason: String,
    pub horizontal_gap: f64,
    pub max_horizontal_gap: f64,
    pub vertical_delta: f64,
    pub distance: f64,
    pub distance_limit: f64,
    pub local_height: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoleculeGapAudit {
    pub row_index: i64,
    pub left_atom_index: i64,
    pub right_atom_index: i64,
    pub gap: f64,
    pub threshold: f64,
    pub next_gap: Option<f64>,
    pub baseline_y: f64,
    pub baseline_delta: f64,
    pub cut: bool,
    pub override_decision: Option<String>,
    pub reason: String,
    pub x: f64,
    pub y: f64,
    pub left_edge: f64,
    pub right_edge: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AtomRowAudit {
    pub row_index: i64,
    pub baseline_y: f64,
    pub display_y: f64,
    pub top_y: f64,
    pub bottom_y: f64,
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
    pub atom_count: i64,
    pub atoms: Vec<AtomPlacementAudit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AtomPlacementAudit {
    pub source_index: i64,
    pub atom_key: String,
    pub row_override: Option<i64>,
    pub x: f64,
    pub y: f64,
    pub w: f64,
    pub h: f64,
    pub baseline_y: f64,
    pub body_y: f64,
    pub bottom_y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MoleculeAudit {
    pub molecule_id: String,
    pub atom_count: i64,
    pub particle_count: i64,
    pub signature: String,
    pub atoms: Vec<AtomAudit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AtomAudit {
    pub atom_id: String,
    pub atom_order: i64,
    pub source_index: i64,
    pub slot: String,
    pub particle_count: i64,
    pub signature: String,
    pub signature_key: String,
    pub internal_contact_count: i64,
    pub centroid_x: f64,
    pub centroid_y: f64,
    pub bounds_x: f64,
    pub bounds_y: f64,
    pub bounds_w: f64,
    pub bounds_h: f64,
    pub particles: Vec<ParticleAudit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParticleAudit {
    pub particle_id: i64,
    pub particle_order: i64,
    pub family: String,
    pub structural_config: Option<String>,
    pub anchor_x: f64,
    pub anchor_y: f64,
    pub bounds_x: f64,
    pub bounds_y: f64,
    pub bounds_w: f64,
    pub bounds_h: f64,
    pub length: f64,
    pub angle: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParticlePagePacket {
    pub image_id: i64,
    pub particles: Vec<Particle>,
    pub molecules: Vec<Molecule>,
    pub atoms: Vec<Atom>,
    pub cluster_explanation: ClusterExplanation,
    pub molecule_audits: Vec<MoleculeAudit>,
}
