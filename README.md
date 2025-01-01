# PointsPulse Extension

Track and manage your loyalty points and miles across multiple programs, all in one convenient dashboard. **PointsPulse** automatically scrapes balances from each program’s site, stores historical data, calculates valuations, and lets you see your total balance worth at a glance. You can also quickly refresh your balances by clicking links that navigate you directly to each program’s page, triggering the content scripts to scrape the latest data.

## Key Features

1. **Automatic Balance Scraping**  
   - **Content Scripts** run on supported program sites to **fetch your points** automatically whenever you visit those pages.

2. **Historical Data & Trends**  
   - Maintains a **history array** for each program, preserving older balances along with timestamps.

3. **Valuation & Total Worth**  
   - Each program’s points are assigned a **monetary value**. The dashboard shows both per-point **valuation** and your **total worth** in USD.

4. **Manual Refresh via Quick Links**  
   - Each program row in the **PointsPulse Dashboard** includes a **link** to that program’s official site. One click logs you in (if needed) and triggers the **content script** to scrape updated balances.

5. **Sorting**  
   - Click **column headers** to sort by Program (alphabetically), Balance, Valuation, Total Worth (all descending), or Last Updated (most recent first).

6. **Customizable Storage**  
   - Persists program data in `chrome.storage.local`. Data includes `displayName` and a `history` array with `[timestamp, balance]`.

7. **Manual Valuation Updates**  
   - Valuations are **hardcoded** but easily adjustable whenever bloggers or personal research indicate new valuations. A timestamp indicates the last time valuations were updated.

---

## Supported Programs

Below is a list of recognized loyalty programs with direct links (as configured in `programURLs`). Clicking these links from the Dashboard will open the official site, triggering content scripts if the site is supported.

### Bank Points

| Program                                | Official Website                                    |
|----------------------------------------|------------------------------------------------------|
| American Express Membership Rewards    | [https://americanexpress.com/](https://americanexpress.com/) |
| Bilt Rewards                           | [https://www.bilt.com/](https://www.bilt.com/)      |
| Capital One Miles                      | [https://www.capitalone.com/](https://www.capitalone.com/) |
| Chase Ultimate Rewards                 | [https://www.chase.com/](https://www.chase.com/)    |
| Citi ThankYou Rewards                  | [https://www.citi.com/](https://www.citi.com/)      |
| Wells Fargo Rewards                    | [https://www.wellsfargo.com/](https://www.wellsfargo.com/) |

### Airline Miles

| Program                                 | Official Website                                         |
|-----------------------------------------|-----------------------------------------------------------|
| Air Canada Aeroplan                     | [https://www.aircanada.com/aeroplan](https://www.aircanada.com/aeroplan) |
| Alaska Airlines Mileage Plan            | [https://www.alaskaair.com/](https://www.alaskaair.com/) |
| American Airlines AAdvantage            | [https://www.aa.com/](https://www.aa.com/)               |
| Delta Air Lines SkyMiles                | [https://www.delta.com/](https://www.delta.com/)         |
| United Airlines MileagePlus             | [https://www.united.com/](https://www.united.com/)       |
| Southwest Airlines Rapid Rewards        | [https://www.southwest.com/](https://www.southwest.com/) |
| Emirates Skywards                       | [https://www.emirates.com/](https://www.emirates.com/)   |
| Etihad Airways Guest                    | [https://www.etihad.com/](https://www.etihad.com/)       |
| Flying Blue (Air France/KLM)           | [https://www.flyingblue.com/](https://www.flyingblue.com/) |
| JetBlue TrueBlue                        | [https://www.jetblue.com/](https://www.jetblue.com/)     |
| Turkish Airlines Miles&Smiles           | [https://www.turkishairlines.com/](https://www.turkishairlines.com/) |
| Virgin Atlantic Flying Club             | [https://www.virginatlantic.com/](https://www.virginatlantic.com/) |

### Hotel Points

| Program                | Official Website                                                    |
|------------------------|--------------------------------------------------------------------|
| Hilton Honors          | [https://www.hilton.com/en/hilton-honors/](https://www.hilton.com/en/hilton-honors/) |
| IHG One Rewards        | [https://www.ihg.com/](https://www.ihg.com/)                       |
| Marriott Bonvoy        | [https://www.marriott.com/](https://www.marriott.com/)             |
| World of Hyatt         | [https://www.hyatt.com/](https://www.hyatt.com/)                   |
| Wyndham Rewards        | [https://www.wyndhamhotels.com/wyndham-rewards](https://www.wyndhamhotels.com/wyndham-rewards) |

*(More can be added or removed to your `programURLs` mapping as desired.)*

---

## How It Works

1. **Install & Open Dashboard**  
   - Once installed, open `dashboard.html` in your extension to see your aggregated balances.

2. **Visit a Loyalty Site**  
   - When you click a **Program** link from the Dashboard, the extension navigates you to the official site. The **content script** for that site scrapes your current balance and sends an update to `background.js`.

3. **Data Storage & Display**  
   - The new balance is appended to your **programData** in `chrome.storage.local`.  
   - Next time you open or refresh the Dashboard, the **latest balance** (and historical entries) appear, along with valuations and total worth.

4. **Sorting & Valuation Updates**  
   - Click **column headers** to sort.  
   - Manually update valuations (and their timestamp) in `dashboard.js` whenever you want new blogger valuations.

---

## Contributing & Customization

- **Add/Remove Programs**: Update the `programURLs` object in `dashboard.js` and the corresponding `content_scripts` for each new site.  
- **Adjust Valuations**: Edit the `valuationData` object in `dashboard.js` along with the `valuationUpdateTimestamp`.  
- **Change Storage Logic**: The `background.js` file currently records new snapshots if the balance changes or enough time (5 minutes) has passed since the last entry.

Feel free to **fork** or **clone** the repo and tailor it to your needs. If you discover new loyalty programs or updated site structures, please submit a pull request or open an issue.

---

**Enjoy tracking and maximizing your points and miles with PointsPulse!**