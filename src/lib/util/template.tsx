import { TableProps } from "antd";

export namespace table {
  export const scrollX = <T = any,>(): TableProps<T> => {
    return {
      scroll: {
        x: true,
      },
      components: {
        header: {
          cell: (cellProps: any) => {
            return (
              <th
                {...cellProps}
                style={{
                  ...cellProps.style,
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
                  ...cellProps.style,
                  padding: "4px 8px",
                  wordBreak: "keep-all",
                  whiteSpace: "nowrap",
                }}
              />
            );
          },
        },
      },
    };
  };
}
