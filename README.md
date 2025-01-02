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

| Program                                | Official Website                                     |
|----------------------------------------|------------------------------------------------------|
| American Express Membership Rewards    | https://global.americanexpress.com/overview          |
| Bilt Rewards                           | https://www.biltrewards.com/                         |
| Capital One Miles                      | :pushpin: |
| Chase Ultimate Rewards                 | :pushpin: |
| Citi ThankYou Rewards                  | :pushpin: |
| U.S. Bank Altitude Reserve             | https://onlinebanking.usbank.com/digital/servicing/rewards-management |
| Wells Fargo Rewards                    | :pushpin: |

### Airline Miles

| Program                                 | Official Website                                          |
|-----------------------------------------|-----------------------------------------------------------|
| Air Canada Aeroplan                     | :pushpin: |
| Alaska Airlines Mileage Plan            | :pushpin: |
| American Airlines AAdvantage            | https://www.aa.com/homePage.do <br> https://www.aa.com/aadvantage-program/profile/account-summary |
| Delta Air Lines SkyMiles                | https://www.delta.com/myprofile/personal-details |
| United Airlines MileagePlus             | https://www.united.com/en/us/myunited |
| Southwest Airlines Rapid Rewards        | :pushpin: |
| Emirates Skywards                       | :pushpin: |
| Etihad Airways Guest                    | :pushpin: |
| Flying Blue (Air France/KLM)            | :pushpin: |
| JetBlue TrueBlue                        | :pushpin: |
| Turkish Airlines Miles&Smiles           | :pushpin: |
| Virgin Atlantic Flying Club             | :pushpin: |

### Hotel Points

| Program                | Official Website                                                    |
|------------------------|--------------------------------------------------------------------|
| Hilton Honors          | https://www.hilton.com/en/hilton-honors/guest/my-account/ |
| IHG One Rewards        | :pushpin: |
| Marriott Bonvoy        | https://www.marriott.com/loyalty/myAccount/default.mi |
| World of Hyatt         | :pushpin: |
| Wyndham Rewards        | :pushpin: |

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
