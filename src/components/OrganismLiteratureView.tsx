// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Alert, Row, Typography, Tooltip } from "antd"
import { OrganismLiterature } from "../models/organismLiterature"
import Table, { ColumnsType } from 'antd/es/table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

const { Text } = Typography

interface PubMedTableDataType {
  key: string
  evidence: string
  evidence_class: string
  fromPubMed: string
  activityScore: number
}


const mapLiteratureToPubMedColumnsData = (literature: OrganismLiterature | null): PubMedTableDataType[] => {
  return literature?.results.bindings.map((binding, index) => {
    const column: PubMedTableDataType = {
      key: `PubMed-${index}-${binding.pmid.value}`,
      evidence: binding.evidence.value,
      evidence_class: binding.evidence_class.value,
      fromPubMed: binding.pmid.value,
      activityScore: parseFloat(Number(binding.activity_score.value).toFixed(2))
    }
    return column
  }) || []
}


interface OrganismLiteratureProps {
  organismLiterature: OrganismLiterature | null
}

const OrganismLiteratureView: React.FC<OrganismLiteratureProps> = ({ organismLiterature }) => {
  const pubMedColumnsDataSource = mapLiteratureToPubMedColumnsData(organismLiterature)

  const futuristicStyles = {
    border: 'none', // Remove borders
    fontFamily: 'Arial, sans-serif', // Futuristic font family
  };

  const pubMedColumns: ColumnsType<PubMedTableDataType> = [
    {
        title: <Tooltip title="Select more precisely literature evidences for the chemical">Class</Tooltip>,
        dataIndex: 'evidence_class',
        key: 'evidence_class',
        width: 50,
        render: (evidence_class) => {
            return <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{evidence_class}</Text>
        },
        filters: [
            { text: 'Strong', value: 'Strong' },
            { text: 'Medium', value: 'Medium' },
            { text: 'Weak', value: 'Weak' },
            { text: 'Supplementary', value: 'Supplementary' },
        ],
        onFilter: (value, record) => record.evidence_class.indexOf(value.toString()) === 0,
        sorter: (a, b) => {
            const order = ['Strong', 'Medium', 'Weak', 'Supplementary'];
            return order.indexOf(a.evidence_class) - order.indexOf(b.evidence_class);
        },
    },
    {
      title: 'Evidence',
      dataIndex: 'evidence',
      key: 'evidence',
      width: 450,
      render: (evidence) => {
        return <Alert
        message={
          <span>
            <FontAwesomeIcon icon={faRobot} style={{ marginRight: '5px'}} />
            : {evidence}
          </span>
        }
        type="info"
        style={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}
      />
      }
    },
    {
      title: 'PubMed reference',
      dataIndex: 'fromPubMed',
      key: 'fromPubMed',
      width: 100,
      render: (link) => (
        <a href={link} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/US-NLM-PubMed-Logo.svg/2560px-US-NLM-PubMed-Logo.svg.png" alt="PubMed Logo" style={{ width: '120px', height: '40px' }} />
            </div>
        </a>
      )
    }
  ]


  return <Row style={{ justifyContent: 'space-between' }}>
    <Table
    columns={pubMedColumns}
    dataSource={pubMedColumnsDataSource}
    onChange={(pagination, filters) => {
         pubMedColumnsDataSource.filter(
            (item) => !filters.evidence_class || filters.evidence_class.includes(item.evidence_class)
        );
    }}
    style={{ width: '100%', ...futuristicStyles }}
    pagination={{ pageSize: 5 }}
/>
  </Row>
}

export default OrganismLiteratureView
