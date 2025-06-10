import { useEffect, useState } from "react";
import ReportService from "../../services/ReportService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
  "#ffbb28",
  "#00C49F",
];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const minimalStyles = {
  container: {
    fontFamily: "Inter, Arial, sans-serif",
    background: "#fafbfc",
    color: "#222",
    minHeight: "100vh",
    padding: "32px 0",
  } as React.CSSProperties,
  section: {
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    padding: 24,
    marginBottom: 32,
    maxWidth: 700,
    marginLeft: "auto",
    marginRight: "auto",
  } as React.CSSProperties,
  h1: {
    fontWeight: 700,
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: 32,
    textAlign: "center",
  } as React.CSSProperties,
  h2: {
    fontWeight: 600,
    fontSize: 22,
    marginBottom: 18,
    marginTop: 0,
    letterSpacing: -0.5,
  } as React.CSSProperties,
  h3: {
    fontWeight: 500,
    fontSize: 18,
    margin: "24px 0 10px 0",
  } as React.CSSProperties,
  h4: {
    fontWeight: 500,
    fontSize: 16,
    margin: "18px 0 8px 0",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 15,
    background: "#fff",
    marginBottom: 16,
  } as React.CSSProperties,
  th: {
    background: "#f5f6fa",
    fontWeight: 600,
    padding: "8px 10px",
    borderBottom: "1px solid #eaeaea",
    textAlign: "left",
  } as React.CSSProperties,
  td: {
    padding: "8px 10px",
    borderBottom: "1px solid #f0f0f0",
    textAlign: "left",
  } as React.CSSProperties,
  trHover: {
    transition: "background 0.2s",
  } as React.CSSProperties,
  totalRow: {
    background: "#f5f6fa",
    fontWeight: 600,
  } as React.CSSProperties,
  textEnd: {
    textAlign: "right",
  } as React.CSSProperties,
  strong: {
    fontWeight: 700,
  } as React.CSSProperties,
  loading: {
    color: "#aaa",
    fontStyle: "italic",
    margin: "16px 0",
  } as React.CSSProperties,
};

const ReportsDashboard = () => {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 4);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 4);

    ReportService.getSalesReport({
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    })
      .then((res) => setSalesReport(res.data))
      .catch((err) => console.error("Failed to load sales report", err));

    ReportService.getInventoryReport()
      .then((res) => setInventoryReport(res.data))
      .catch((err) => console.error("Failed to load inventory report", err));
  }, []);

  return (
    <div style={minimalStyles.container}>
      <h1 style={minimalStyles.h1}>Reports Dashboard</h1>
      <div
        style={{
          display: "flex",
          gap: 32,
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <section style={{ ...minimalStyles.section, flex: 1, minWidth: 340 }}>
          <h2 style={minimalStyles.h2}>Sales Report</h2>
          {salesReport ? (
            <>
              <p>
                Total Sales:{" "}
                <span style={minimalStyles.strong}>
                  ₱{salesReport.totalSales}
                </span>
              </p>

              <h3 style={minimalStyles.h3}>Daily Sales</h3>
              <div style={{ maxWidth: 600 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={salesReport.dailySales ?? []}>
                    <XAxis dataKey="sale_date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_quantity" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <h4 style={minimalStyles.h4}>Items Sold Per Day</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={minimalStyles.table}>
                  <thead>
                    <tr>
                      <th style={minimalStyles.th}>Date</th>
                      <th style={minimalStyles.th}>Item</th>
                      <th
                        style={{
                          ...minimalStyles.th,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        Quantity Sold
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.dailySales?.flatMap((day: any, i: number) =>
                      day.items?.map((item: any, j: number) => (
                        <tr key={`₱{i}-₱{j}`} style={minimalStyles.trHover}>
                          <td style={minimalStyles.td}>
                            {j === 0 ? day.sale_date : ""}
                          </td>
                          <td style={minimalStyles.td}>{item.item_name}</td>
                          <td
                            style={{
                              ...minimalStyles.td,
                              ...minimalStyles.textEnd,
                            }}
                          >
                            {item.quantity_sold}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p style={minimalStyles.loading}>Loading sales report...</p>
          )}
        </section>

        <section style={{ ...minimalStyles.section, flex: 1, minWidth: 340 }}>
          <h2 style={minimalStyles.h2}>Inventory Report</h2>
          {inventoryReport ? (
            <>
              <p>
                Total Inventory Value:{" "}
                <span style={minimalStyles.strong}>
                  ₱{inventoryReport.totalInventoryValue?.toFixed(2)}
                </span>
              </p>

              <div style={{ overflowX: "auto" }}>
                <table style={minimalStyles.table}>
                  <thead>
                    <tr>
                      <th style={minimalStyles.th}>Item</th>
                      <th
                        style={{
                          ...minimalStyles.th,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        Price (₱)
                      </th>
                      <th
                        style={{
                          ...minimalStyles.th,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        Stock
                      </th>
                      <th
                        style={{
                          ...minimalStyles.th,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        Possible Profit (₱)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryReport.items?.map((item: any, idx: number) => {
                      const price = Number(item.item_price) || 0;
                      const quantity = Number(item.item_quantity) || 0;
                      const possibleProfit = price * quantity;
                      return (
                        <tr key={idx} style={minimalStyles.trHover}>
                          <td style={minimalStyles.td}>{item.item_name}</td>
                          <td
                            style={{
                              ...minimalStyles.td,
                              ...minimalStyles.textEnd,
                            }}
                          >
                            {price.toFixed(2)}
                          </td>
                          <td
                            style={{
                              ...minimalStyles.td,
                              ...minimalStyles.textEnd,
                            }}
                          >
                            {quantity}
                          </td>
                          <td
                            style={{
                              ...minimalStyles.td,
                              ...minimalStyles.textEnd,
                            }}
                          >
                            {possibleProfit.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={minimalStyles.totalRow}>
                      <td
                        colSpan={3}
                        style={{
                          ...minimalStyles.td,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        Total Possible Profit:
                      </td>
                      <td
                        style={{
                          ...minimalStyles.td,
                          ...minimalStyles.textEnd,
                        }}
                      >
                        {inventoryReport.items
                          ?.reduce((sum: number, item: any) => {
                            const price = Number(item.item_price) || 0;
                            const quantity = Number(item.item_quantity) || 0;
                            return sum + price * quantity;
                          }, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <h3 style={minimalStyles.h3}>Low Stock Items</h3>
              <div style={{ maxWidth: 600, paddingLeft: 0 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={
                      inventoryReport.lowStockItems?.map((item: any) => ({
                        name: item.item_name,
                        quantity: item.item_quantity,
                      })) ?? []
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis
                      domain={[
                        0,
                        Math.max(
                          150,
                          ...(inventoryReport.lowStockItems?.map(
                            (item: any) => item.item_quantity
                          ) ?? [])
                        ),
                      ]}
                    />
                    <Tooltip />
                    <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" />
                    <Bar dataKey="quantity" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p style={minimalStyles.loading}>Loading inventory report...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportsDashboard;
