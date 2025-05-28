// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface ChemicalLiterature {
  head: ChemicalLiteratureHead
  results: ChemicalLiteratureResults
}

interface ChemicalLiteratureHead {
  link: string[]
  vars: string[]
}

interface ChemicalLiteratureResults {
  distinct: boolean
  ordered: boolean
  bindings: ChemicalLiteratureBinding[]
}

export interface ChemicalLiteratureBinding {
  abstract: BindingData
  activity_score: BindingData
  g: BindingData
  evidence: BindingData
  evidence_class: BindingData
  pmid: BindingData
  title: BindingData
}

interface BindingData {
  type: string
  value: string
}
