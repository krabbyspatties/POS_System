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
    <div>
      <h1>Reports Dashboard</h1>

      <section>
        <h2>Sales Report</h2>
        {salesReport ? (
          <>
            <p>Total Sales: ${salesReport.totalSales}</p>

            <h3>Daily Sales</h3>
            <div style={{ maxWidth: 600 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesReport.dailySales ?? []}>
                  <XAxis dataKey="sale_date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h4 className="mt-3">Items Sold Per Day</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th className="text-end">Quantity Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.dailySales?.flatMap((day: any, i: number) =>
                    day.items?.map((item: any, j: number) => (
                      <tr key={`${i}-${j}`}>
                        <td>{j === 0 ? day.sale_date : ""}</td>
                        <td>{item.item_name}</td>
                        <td className="text-end">{item.quantity_sold}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Loading sales report...</p>
        )}
      </section>

      <section>
        <h2>Inventory Report</h2>
        {inventoryReport ? (
          <>
            <p>
              Total Inventory Value:{" "}
              <strong>
                ${inventoryReport.totalInventoryValue?.toFixed(2)}
              </strong>
            </p>

            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Item</th>
                    <th className="text-end">Price ($)</th>
                    <th className="text-end">Stock</th>
                    <th className="text-end">Possible Profit ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryReport.items?.map((item: any, idx: number) => {
                    const price = Number(item.item_price) || 0;
                    const quantity = Number(item.item_quantity) || 0;
                    const possibleProfit = price * quantity;
                    return (
                      <tr key={idx}>
                        <td>{item.item_name}</td>
                        <td className="text-end">{price.toFixed(2)}</td>
                        <td className="text-end">{quantity}</td>
                        <td className="text-end">
                          {possibleProfit.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">
                      Total Possible Profit:
                    </td>
                    <td className="text-end fw-bold">
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

            <h3 className="mt-5">Low Stock Items</h3>
            <div style={{ maxWidth: 600, paddingLeft: 20 }}>
              <ResponsiveContainer width="100%" height={250}>
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
          <p>Loading inventory report...</p>
        )}
      </section>
    </div>
  );
};

export default ReportsDashboard;
