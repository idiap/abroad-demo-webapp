// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Input, Row, Tooltip } from 'antd';
import { TableAlerts } from '../models/tableAlerts';
import Table, { ColumnsType } from 'antd/es/table';

interface AlertTableDataType {
  key: string;
  verbatimIdentification: string;
  chemicalAlerts: number;
  organismAlerts: number;
}

const mapAlertsToColumnsData = (alerts: TableAlerts | null): AlertTableDataType[] => {
  return (
    alerts?.results.bindings.map((binding, index) => {
      const column: AlertTableDataType = {
        key: `Alert-${index}-${binding.verbatim_identification.value}`,
        verbatimIdentification: binding.verbatim_identification.value,
        chemicalAlerts: Number(binding.n_chemical_alert.value),
        organismAlerts: Number(binding.n_organism_alert.value),
      };
      return column;
    }) || []
  );
};

interface AlterTableProps {
  alerts: TableAlerts | null;
}

const AlertTableView: React.FC<AlterTableProps> = ({ alerts }) => {
  const AlertColumnsDataSource = mapAlertsToColumnsData(alerts);

  const AlertColumns: ColumnsType<AlertTableDataType> = [
    {
      title: <Tooltip title="The verbatim identification provided by the user">Verbatim identification</Tooltip>,
      dataIndex: 'verbatimIdentification',
      key: 'verbatimIdentification',
      width: 100,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search verbatim identification"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Row style={{ justifyContent: 'space-between' }}>
            <button onClick={clearFilters}>Reset</button>
            <button type="button" onClick={() => confirm()}>
              OK
            </button>
          </Row>
        </div>
      ),
      onFilter: (value: any, record) => record.verbatimIdentification.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <div style={{ color: record.organismAlerts > 0 || record.chemicalAlerts > 0 ? '#ff6666' : 'inherit', fontStyle: 'italic'}}>
          {text}
        </div>
        ),
    },
    {
      title: <Tooltip title="The number of articles from the retrieved literature of the organism reporting evidences from the selected type (Strong, Medium, or Weak)">Number of articles discussing the organism with antibiotic activity evidence(s)</Tooltip>,
      dataIndex: 'organismAlerts',
      key: 'organismAlerts',
      width: 100,
      sorter: (a, b) => a.organismAlerts - b.organismAlerts,
    },
    {
      title: <Tooltip title="The number of chemicals, isolated from the organism, for which at least one related article report evidences from the selected type (Strong, Medium, or Weak)">Number of chemicals with antibiotic activity evidence(s)</Tooltip>,
      dataIndex: 'chemicalAlerts',
      key: 'chemicalAlerts',
      width: 100,
      sorter: (a, b) => a.chemicalAlerts - b.chemicalAlerts,
    },
  ];

  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Table columns={AlertColumns} dataSource={AlertColumnsDataSource} style={{ width: '100%' }} pagination={{ pageSize: 20 }}/>
    </Row>
  );
};

export default AlertTableView;
