import React from 'react';

export default function BranchReports() {
  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Branch Performance &amp; Comparison</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Consolidated view of Zangmo and Mehdi branches.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded hover:bg-surface-container-low transition-colors text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_month</span>
            Last 30 Days
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">arrow_drop_down</span>
          </button>
          {/* Export Actions */}
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded hover:bg-surface-container-low transition-colors text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">description</span>
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors text-body-sm font-semibold">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export Excel
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter pb-8">
        {/* Consolidated Topline KPI Cards (Full Width span broken into 3) */}
        <div className="col-span-12 grid grid-cols-3 gap-gutter">
          {/* Total Revenue */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed opacity-20 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Consolidated Revenue</span>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg text-display-lg text-primary font-mono-data">$142,850.00</span>
              <span className="flex items-center text-sm text-[#146c2e] font-semibold bg-[#e6f4ea] px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 8.4%
              </span>
            </div>
          </div>
          {/* Total Orders */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Orders</span>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg text-display-lg text-primary font-mono-data">3,492</span>
              <span className="flex items-center text-sm text-[#146c2e] font-semibold bg-[#e6f4ea] px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 2.1%
              </span>
            </div>
          </div>
          {/* Avg Ticket Size */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Avg Ticket Size</span>
            <div className="flex items-baseline gap-3">
              <span className="font-display-lg text-display-lg text-primary font-mono-data">$40.90</span>
              <span className="flex items-center text-sm text-error font-semibold bg-error-container px-1.5 py-0.5 rounded">
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span> 1.2%
              </span>
            </div>
          </div>
        </div>

        {/* Main Charts Row */}
        {/* Sales Trend Chart Area (Spans 8 cols) */}
        <div className="col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-title-lg text-title-lg text-primary">Revenue Trend Comparison</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="font-label-md text-label-md text-on-surface-variant">Zangmo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                <span className="font-label-md text-label-md text-on-surface-variant">Mehdi</span>
              </div>
            </div>
          </div>
          {/* CSS Based Chart Representation */}
          <div className="flex-1 relative min-h-[240px] flex items-end gap-2 pt-10 border-b border-l border-outline-variant pb-2 pl-2">
            {/* Y-Axis Labels */}
            <div className="absolute left-[-40px] top-0 bottom-0 flex flex-col justify-between text-[10px] text-on-surface-variant font-mono-data py-2">
              <span>$5k</span><span>$4k</span><span>$3k</span><span>$2k</span><span>$1k</span><span>0</span>
            </div>
            {/* Grid Lines */}
            <div className="absolute left-0 right-0 top-0 bottom-2 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-outline"></div>
              <div className="w-full border-b border-outline"></div>
              <div className="w-full border-b border-outline"></div>
              <div className="w-full border-b border-outline"></div>
              <div className="w-full border-b border-outline"></div>
              <div className="w-full border-b border-outline"></div>
            </div>
            {/* Bars for Zangmo/Mehdi (Pairs) */}
            <div className="flex-1 flex justify-center items-end gap-1 group">
              <div className="w-4 bg-primary h-[60%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
              <div className="w-4 bg-secondary-container h-[45%] rounded-t-sm hover:opacity-80 transition-opacity"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[70%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[50%] rounded-t-sm"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[85%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[60%] rounded-t-sm"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[50%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[40%] rounded-t-sm"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[90%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[75%] rounded-t-sm"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[100%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[85%] rounded-t-sm"></div>
            </div>
            <div className="flex-1 flex justify-center items-end gap-1">
              <div className="w-4 bg-primary h-[75%] rounded-t-sm"></div>
              <div className="w-4 bg-secondary-container h-[65%] rounded-t-sm"></div>
            </div>
          </div>
          {/* X-Axis Labels */}
          <div className="flex justify-between pl-2 pt-2 text-[10px] text-on-surface-variant font-mono-data">
            <div className="flex-1 text-center">Mon</div>
            <div className="flex-1 text-center">Tue</div>
            <div className="flex-1 text-center">Wed</div>
            <div className="flex-1 text-center">Thu</div>
            <div className="flex-1 text-center">Fri</div>
            <div className="flex-1 text-center">Sat</div>
            <div className="flex-1 text-center">Sun</div>
          </div>
        </div>

        {/* Category Sales Share (Spans 4 cols) */}
        <div className="col-span-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col">
          <h3 className="font-title-lg text-title-lg text-primary mb-6">Sales by Category</h3>
          <div className="flex-1 flex flex-col justify-center gap-5">
            {/* Category 1 */}
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface font-semibold">Mains (Hot)</span>
                <span className="font-mono-data text-on-surface-variant">45%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                <div className="bg-primary h-full" style={{width: '25%'}}></div>
                <div className="bg-secondary-container h-full" style={{width: '20%'}}></div>
              </div>
            </div>
            {/* Category 2 */}
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface font-semibold">Beverages</span>
                <span className="font-mono-data text-on-surface-variant">30%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                <div className="bg-primary h-full" style={{width: '18%'}}></div>
                <div className="bg-secondary-container h-full" style={{width: '12%'}}></div>
              </div>
            </div>
            {/* Category 3 */}
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface font-semibold">Appetizers</span>
                <span className="font-mono-data text-on-surface-variant">15%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                <div className="bg-primary h-full" style={{width: '8%'}}></div>
                <div className="bg-secondary-container h-full" style={{width: '7%'}}></div>
              </div>
            </div>
            {/* Category 4 */}
            <div>
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface font-semibold">Desserts</span>
                <span className="font-mono-data text-on-surface-variant">10%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                <div className="bg-primary h-full" style={{width: '6%'}}></div>
                <div className="bg-secondary-container h-full" style={{width: '4%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Comparison Table (Full Width) */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col mt-2">
          <div className="px-5 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
            <h3 className="font-title-lg text-title-lg text-primary">Detailed Branch Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  <th className="font-label-md text-label-md text-on-surface-variant uppercase p-4 pl-5">Metric</th>
                  <th className="font-label-md text-label-md text-on-surface-variant uppercase p-4 text-right">Zangmo Branch</th>
                  <th className="font-label-md text-label-md text-on-surface-variant uppercase p-4 text-right">Mehdi Branch</th>
                  <th className="font-label-md text-label-md text-on-surface-variant uppercase p-4 pr-5 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="text-body-sm text-on-surface font-mono-data">
                <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 pl-5 font-body-sm font-semibold text-primary">Gross Sales</td>
                  <td className="p-4 text-right">$82,400.00</td>
                  <td className="p-4 text-right">$60,450.00</td>
                  <td className="p-4 pr-5 text-right text-[#146c2e]">+ $21,950</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 pl-5 font-body-sm font-semibold text-primary">Discounts &amp; Voids</td>
                  <td className="p-4 text-right text-error">$1,200.00</td>
                  <td className="p-4 text-right text-error">$850.00</td>
                  <td className="p-4 pr-5 text-right text-error">- $350</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 pl-5 font-body-sm font-semibold text-primary">Net Sales</td>
                  <td className="p-4 text-right font-bold">$81,200.00</td>
                  <td className="p-4 text-right font-bold">$59,600.00</td>
                  <td className="p-4 pr-5 text-right text-[#146c2e] font-bold">+ $21,600</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                  <td className="p-4 pl-5 font-body-sm font-semibold text-primary">Labor Cost %</td>
                  <td className="p-4 text-right">22.4%</td>
                  <td className="p-4 text-right">24.1%</td>
                  <td className="p-4 pr-5 text-right text-error">- 1.7%</td>
                </tr>
                <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                  <td className="p-4 pl-5 font-body-sm font-semibold text-primary">COGS %</td>
                  <td className="p-4 text-right">28.5%</td>
                  <td className="p-4 text-right">29.0%</td>
                  <td className="p-4 pr-5 text-right text-[#146c2e]">- 0.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
