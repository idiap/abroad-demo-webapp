// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface OrganismRelation {
  head: OrganismRelationHead
  results: OrganismRelationResults
}

interface OrganismRelationHead {
  link: string[]
  vars: string[]
}

interface OrganismRelationResults {
  distinct: boolean
  ordered: boolean
  bindings: OrganismRelationBinding[]
}

interface OrganismRelationBinding {
  gbif_extended: BindingData
  gbif_extended_id: BindingData
  specie_linked_label: BindingData
  chem_label: BindingData
  max_re_score: BindingData
  all_rel_types: BindingData
  literature_ids: BindingData
}

interface BindingData {
  type: string
  datatype: string
  value: string
}
