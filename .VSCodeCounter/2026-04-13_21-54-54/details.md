# Details

Date : 2026-04-13 21:54:54

Directory c:\\Claude Code\\mtproto-proxy-hub

Total : 50 files,  10672 codes, 261 comments, 1393 blanks, all 12326 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.github/FUNDING.yml](/.github/FUNDING.yml) | YAML | 0 | 5 | 2 | 7 |
| [.github/ISSUE_TEMPLATE/bug_report.md](/.github/ISSUE_TEMPLATE/bug_report.md) | Markdown | 26 | 0 | 8 | 34 |
| [.github/ISSUE_TEMPLATE/feature_request.md](/.github/ISSUE_TEMPLATE/feature_request.md) | Markdown | 17 | 0 | 6 | 23 |
| [README.md](/README.md) | Markdown | 136 | 0 | 40 | 176 |
| [backend/main.py](/backend/main.py) | Python | 271 | 7 | 57 | 335 |
| [backend_cpp/INSTALL.md](/backend_cpp/INSTALL.md) | Markdown | 104 | 0 | 33 | 137 |
| [backend_cpp/README.md](/backend_cpp/README.md) | Markdown | 80 | 0 | 25 | 105 |
| [backend_cpp/build.bat](/backend_cpp/build.bat) | Batch | 48 | 1 | 8 | 57 |
| [backend_cpp/main.cpp](/backend_cpp/main.cpp) | C++ | 375 | 24 | 95 | 494 |
| [backend_csharp/Program.cs](/backend_csharp/Program.cs) | C# | 38 | 1 | 12 | 51 |
| [backend_csharp/ProxyChecker.cs](/backend_csharp/ProxyChecker.cs) | C# | 292 | 1 | 58 | 351 |
| [backend_csharp/ProxyChecker.csproj](/backend_csharp/ProxyChecker.csproj) | XML | 7 | 0 | 3 | 10 |
| [backend_csharp/README.md](/backend_csharp/README.md) | Markdown | 68 | 0 | 25 | 93 |
| [frontend/index.html](/frontend/index.html) | HTML | 26 | 4 | 6 | 36 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 2,836 | 0 | 1 | 2,837 |
| [frontend/package.json](/frontend/package.json) | JSON | 35 | 0 | 1 | 36 |
| [frontend/src/App.tsx](/frontend/src/App.tsx) | TypeScript JSX | 419 | 18 | 51 | 488 |
| [frontend/src/components/AutoRefreshControl.tsx](/frontend/src/components/AutoRefreshControl.tsx) | TypeScript JSX | 161 | 1 | 19 | 181 |
| [frontend/src/components/BackendLanguageControl.tsx](/frontend/src/components/BackendLanguageControl.tsx) | TypeScript JSX | 83 | 0 | 11 | 94 |
| [frontend/src/components/CountryTooltip.tsx](/frontend/src/components/CountryTooltip.tsx) | TypeScript JSX | 53 | 4 | 9 | 66 |
| [frontend/src/components/LanguageToggle.tsx](/frontend/src/components/LanguageToggle.tsx) | TypeScript JSX | 22 | 0 | 4 | 26 |
| [frontend/src/components/MapCanvas.tsx](/frontend/src/components/MapCanvas.tsx) | TypeScript JSX | 157 | 6 | 15 | 178 |
| [frontend/src/components/MapControls.tsx](/frontend/src/components/MapControls.tsx) | TypeScript JSX | 65 | 6 | 7 | 78 |
| [frontend/src/components/MapLegend.tsx](/frontend/src/components/MapLegend.tsx) | TypeScript JSX | 49 | 6 | 5 | 60 |
| [frontend/src/components/PingTypeControl.tsx](/frontend/src/components/PingTypeControl.tsx) | TypeScript JSX | 198 | 5 | 25 | 228 |
| [frontend/src/components/ProxyCard.tsx](/frontend/src/components/ProxyCard.tsx) | TypeScript JSX | 232 | 0 | 23 | 255 |
| [frontend/src/components/SkeletonLoader.tsx](/frontend/src/components/SkeletonLoader.tsx) | TypeScript JSX | 45 | 0 | 5 | 50 |
| [frontend/src/components/SortControl.tsx](/frontend/src/components/SortControl.tsx) | TypeScript JSX | 145 | 6 | 24 | 175 |
| [frontend/src/components/ViewModeControl.tsx](/frontend/src/components/ViewModeControl.tsx) | TypeScript JSX | 28 | 0 | 4 | 32 |
| [frontend/src/locales/translations.ts](/frontend/src/locales/translations.ts) | TypeScript | 94 | 20 | 21 | 135 |
| [frontend/src/main.tsx](/frontend/src/main.tsx) | TypeScript JSX | 18 | 0 | 2 | 20 |
| [frontend/src/pages/About.tsx](/frontend/src/pages/About.tsx) | TypeScript JSX | 89 | 0 | 11 | 100 |
| [frontend/src/pages/ProxyMap.tsx](/frontend/src/pages/ProxyMap.tsx) | TypeScript JSX | 171 | 25 | 30 | 226 |
| [frontend/src/services/api.ts](/frontend/src/services/api.ts) | TypeScript | 64 | 0 | 5 | 69 |
| [frontend/src/styles/About.css](/frontend/src/styles/About.css) | CSS | 285 | 2 | 46 | 333 |
| [frontend/src/styles/App.css](/frontend/src/styles/App.css) | CSS | 2,551 | 24 | 464 | 3,039 |
| [frontend/src/styles/ProxyMap.css](/frontend/src/styles/ProxyMap.css) | CSS | 424 | 10 | 83 | 517 |
| [frontend/src/styles/fonts.css](/frontend/src/styles/fonts.css) | CSS | 42 | 2 | 6 | 50 |
| [frontend/src/types/map.ts](/frontend/src/types/map.ts) | TypeScript | 49 | 1 | 8 | 58 |
| [frontend/src/types/proxy.ts](/frontend/src/types/proxy.ts) | TypeScript | 57 | 0 | 2 | 59 |
| [frontend/src/types/sort.ts](/frontend/src/types/sort.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [frontend/src/utils/mapData.ts](/frontend/src/utils/mapData.ts) | TypeScript | 324 | 76 | 39 | 439 |
| [frontend/src/utils/sorting.ts](/frontend/src/utils/sorting.ts) | TypeScript | 51 | 2 | 14 | 67 |
| [frontend/tsconfig.json](/frontend/tsconfig.json) | JSON with Comments | 20 | 0 | 1 | 21 |
| [frontend/vite.config.ts](/frontend/vite.config.ts) | TypeScript | 24 | 0 | 2 | 26 |
| [start/README.md](/start/README.md) | Markdown | 123 | 0 | 43 | 166 |
| [start/start-all.bat](/start/start-all.bat) | Batch | 207 | 4 | 23 | 234 |
| [start/start-backend.bat](/start/start-backend.bat) | Batch | 12 | 0 | 3 | 15 |
| [start/start-frontend.bat](/start/start-frontend.bat) | Batch | 12 | 0 | 3 | 15 |
| [vercel.json](/vercel.json) | JSON | 26 | 0 | 1 | 27 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)