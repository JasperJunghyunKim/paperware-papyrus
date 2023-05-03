import { Api, Protocol } from "@/common";
import { Table } from "antd";
import { ColumnType, ExpandableConfig } from "antd/lib/table/interface";
import { TableComponents } from "rc-table/lib/interface";
import { useMemo } from "react";

interface Props<T> {
  data: Protocol.Record.List<T> | undefined;
  page: Api.Common.GetPaginationQuery;
  setPage: (page: Api.Common.GetPaginationQuery) => void;
  columns: ColumnType<T>[];
  keySelector: (record: T) => string | number;
  selected?: T[];
  onSelectedChange?: (selected: T[]) => void;
  selection?: "none" | "single" | "multiple";
  expandable?: ExpandableConfig<T>;
}

export default function Component<T extends object>(props: Props<T>) {
  const components = useMemo((): TableComponents<T> => {
    return {
      header: {
        cell: (cellProps: any) => {
          return (
            <th
              {...cellProps}
              style={{
                padding: "8px 8px",
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            />
          );
        },
      },
      body: {
        cell: (cellProps: any) => {
          return (
            <td
              {...cellProps}
              style={{
                padding: "4px 8px",
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
              }}
            />
          );
        },
      },
    };
  }, []);

  return (
    <Table<T>
      bordered
      pagination={{
        position: ["bottomCenter"],
        size: "default",
        pageSize: 100,
      }}
      rowKey={props.keySelector}
      scroll={{ x: true }}
      size="small"
      columns={props.columns}
      rowSelection={
        props.selection === "none"
          ? undefined
          : {
              selectedRowKeys: props.selected?.map(props.keySelector),
              onChange: (_selectedRowKeys, selectedRows) => {
                props.onSelectedChange?.(selectedRows as T[]);
              },
              type: props.selection === "single" ? "radio" : "checkbox",
            }
      }
      onRow={(record) => {
        return {
          onClick: () => {
            props.onSelectedChange?.([record]);
          },
        };
      }}
      expandable={props.expandable}
      dataSource={props.data?.items}
      components={components}
    />
  );
}
