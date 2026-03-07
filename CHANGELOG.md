# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- A new dedicated `/changelog` page powered by `react-markdown` to render this file.
- An AI workflow (`casual-commit`) for automatically generating conventional commits with casual descriptions.
- Created the Accounts tab in the admin dashboard to manage admin users.
- Implemented secure `bcrypt` hashed passwords for admin accounts.
- Added a dynamic "Admin" link to the navbar that appears only when logged in.
- Added automatic 16-character password generation for new admins.

### Changed
- Consolidated Staff, Rules, and Server management into the new unified Admin Dashboard (`/admin`).
- Upgraded the Admin Dashboard UI to use the premium glassmorphism design language, matching the homepage.
- Restyled the site with unified design tokens and premium animations (sliders, blobs).

### Fixed
- Fixed an issue where typing in the staff bio kept jumping the cursor to the end of the text.
- Fixed a React setState warning in the navbar mobile menu toggle.

### Removed
- Removed old `/staff/manage` and `/rules/manage` pages.

## [1.1.2] - 2026-02-17

### Added
- Staff member **CCEThan** has been added to the team.
- New Home Page items and Core Page layout.

### Fixed
- General project structure improvements.
- Updated documentation and README.

## [1.0.6] - 2026-02-16

### Added
- **Theme Toggle**: Users can now switch between light and dark modes.

## [1.0.5] - 2026-02-15

### Added
- Search Icon added to the Navbar for better navigation.

## [1.0.4] - 2026-02-15

### Added
- Status Page to monitor server/website health.

## [1.0.3.1] - 2024-02-11

### Added
- Footer Dot for visual consistency.

## [1.0.0] - 2024-02-09

### Added
- Initial release of the NexusMines website.
