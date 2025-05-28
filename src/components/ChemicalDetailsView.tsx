// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Table, Typography, Tooltip } from "antd"
import { ChemicalDetails, ChemicalDetailsBinding } from "../models/chemicalDetails"
import { ColumnsType } from "antd/es/table"
import { Link } from "react-router-dom"

const { Title } = Typography

interface LotusTableDataType {
  key: string
  referenceDOI: string
  pmid: string
}

const mapChemResultToLotusColumnData = (chemBindings?: ChemicalDetailsBinding[]) => {
  return chemBindings?.map((binding, index) => {
    const column: LotusTableDataType = {
      key: `${binding.pmid.value}-${index}`,
      referenceDOI: binding.doi.value,
      pmid: binding.pmid.value,
    }
    return column
  })
}

interface RETableDataType {
  key: string
  source: string
  pmid: string
  reScore: number
  title?: string
  abstract?: string
  texts: string[]
  text?: string // Merged text
}

const mapChemResultToREColumnData = (chemBindings?: ChemicalDetailsBinding[]) => {
  const columnDataObject: Record<string, RETableDataType> = {}
  chemBindings?.forEach((binding, index) => {
    if (columnDataObject[binding.pmid.value] == null) {
      columnDataObject[binding.pmid.value] = {
        key: `${binding.pmid.value}-${index}`,
        source: binding.doi.value,
        pmid: binding.pmid.value,
        reScore: Number(binding.re_score.value),
        texts: [],
      }
    }
    const currentPmidValue = columnDataObject[binding.pmid.value]
    if (binding.content_type.value === 'title') {
      columnDataObject[binding.pmid.value] = { ...currentPmidValue, title: binding.tiab_content.value }
    } else if (binding.content_type.value === 'abstract') {
      columnDataObject[binding.pmid.value] = { ...currentPmidValue, abstract: binding.tiab_content.value }
    } else if (binding.content_type.value === 'text chunk') {
      columnDataObject[binding.pmid.value].texts?.push(binding.tiab_content.value)
    }
  })

  // Merge title, abstract, and text chunks into a new 'Text' column
  Object.values(columnDataObject).forEach((item) => {
    if (item.abstract) {
      item.text = `<b>Title:</b> ${item.title}<br><b>Abstract:</b> ${item.abstract}`
    } else if (item.texts.length > 0) {
      item.text = item.texts.join('<br>')
    }
  });

  return Object.values(columnDataObject)
}

interface ChemicalDetailsProps {
  chemicalDetails: ChemicalDetails | null
  chemLabel: string | null
}

const ChemicalDetailsView: React.FC<ChemicalDetailsProps> = ({ chemicalDetails, chemLabel }) => {
  const lotusNPRResults = chemicalDetails?.results.bindings.filter(binding => binding.rel_type.value === 'LotusNPR') ?? []
  const textNPRResults = chemicalDetails?.results.bindings.filter(binding => binding.rel_type.value === 'TextNPR') ?? []

  const lotusColumns: ColumnsType<LotusTableDataType> = [
    {
      title: 'Reference DOI',
      dataIndex: 'referenceDOI',
      key: 'referenceDOI',
    },
    {
      title: 'Pmid',
      dataIndex: 'pmid',
      key: 'pmid',
      render: (link) => {
        return <Link to={link} target="_blank">{link}</Link>
      }
    }
  ]

  const REColumns: ColumnsType<RETableDataType> = [
    {
      title: <Tooltip title="Direct link to the Pubmed article">Pubmed Reference</Tooltip>,
      dataIndex: 'pmid',
      key: 'pmid',
      width: 100,
      render: (link) => (
        <a href={link} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/US-NLM-PubMed-Logo.svg/2560px-US-NLM-PubMed-Logo.svg.png" alt="PubMed Logo" style={{ width: '120px', height: '40px' }} />
            </div>
        </a>
      ),
      ellipsis: true,
    },
    {
      title: <Tooltip title="The score from the retriever. The higher the more confident the model was that the text reports natural products relationships">Retriever Score</Tooltip>,
      dataIndex: 'reScore',
      key: 'reScore',
      width: 75,
      ellipsis: true,
      render: (text) => parseFloat(text).toFixed(2)
    },
    {
      title: <Tooltip title="The text from which the relation was extracted">Source Text</Tooltip>,
      dataIndex: 'text',
      key: 'text',
      width: 400,
      render: (text) => <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{ __html: text }}></div>
    }
  ]

  return <div style={{ overflow: 'scroll' }}>
    {lotusNPRResults.length > 0 ? <>
      <Title level={4}>Details from the LOTUS database:</Title>
      <Table columns={lotusColumns} dataSource={mapChemResultToLotusColumnData(lotusNPRResults)}></Table>
    </> : <></>}
    {textNPRResults.length > 0 ? <>
      <Title level={4}>Details of the extraction:</Title>
      <Table
        columns={REColumns}
        dataSource={mapChemResultToREColumnData(textNPRResults)}
        scroll={{ x: 1300 }}
      />
    </> : <></>}
  </div>
}

export default ChemicalDetailsView
