// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface OrganismLiterature {
  head: OrganismLiteratureHead
  results: OrganismLiteratureResults
}

interface OrganismLiteratureHead {
  link: string[]
  vars: string[]
}

interface OrganismLiteratureResults {
  distinct: boolean
  ordered: boolean
  bindings: OrganismLiteratureBinding[]
}

export interface OrganismLiteratureBinding {
  abstract: BindingData
  g: BindingData
  pmid: BindingData
  evidence_class: BindingData
  evidence: BindingData
  activity_score: BindingData
  title: BindingData
}

interface BindingData {
  type: string
  value: string
}
