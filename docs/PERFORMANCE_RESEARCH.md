# Athletic Performance Features — Research & Proposals

Research into track cycling performance features for GearedtoTrack, ordered by implementation priority.

---

## 1. Personal Bests Timeline

**Value:** High — uses existing lap_times data, no new inputs required.

**Description:** Chart showing PB progression over time per event type (e.g., Flying 200m, 500m TT, Individual Pursuit). Users can see their improvement trajectory at a glance.

**Implementation:**
- Query `lap_times` grouped by event type, filtered for fastest per session date
- Line chart with date on X-axis, time on Y-axis (inverted — lower is better)
- Highlight current PB with a marker
- Library options: lightweight chart lib (e.g., recharts or Chart.js via react-chartjs-2)

**Data model:** No schema changes — uses existing `lap_sessions` + `lap_times` tables.

---

## 2. Event-Specific Gear Recommendations

**Value:** High — directly actionable advice for riders choosing gears.

**Description:** Given a track length, event type (Sprint, Pursuit, Keirin, Scratch), and rider level (beginner/intermediate/advanced), suggest optimal gear ratios based on established track cycling conventions.

**Implementation:**
- Lookup table of recommended gear ranges per event/level/track-length
- Sources: British Cycling coaching guides, common velodrome recommendations
- Display as a range (e.g., "48/15 to 51/14") with gear inches and development
- Compare against user's saved gear setups

**Data model:** Static lookup data, no schema changes.

---

## 3. Pacing Calculator

**Value:** Medium-High — essential for pursuit and timed events.

**Description:** Input a target time and track length, get required lap splits. For example: 4:30 Individual Pursuit on a 250m track = 18 laps, target ~15s per lap with negative-split pacing strategy.

**Implementation:**
- Inputs: target total time, track length (250m/333m), number of laps or event distance
- Outputs: even splits, negative-split strategy (first lap slower due to standing start), progressive strategy
- Display as a table of lap-by-lap target times
- Option to compare pacing plan against actual recorded splits

**Data model:** No schema changes — calculation only.

---

## 4. Estimated Power from Lap Times

**Value:** Medium — useful for riders without power meters.

**Description:** Approximate average power output using physics-based models. Inputs: lap time, track length, gear ratio, rider weight, bike weight. Uses air resistance (CdA), rolling resistance (Crr), and drivetrain losses.

**Implementation:**
- Physics model: P = P_aero + P_rolling + P_gravity + P_acceleration
- P_aero = 0.5 × ρ × CdA × v³ (CdA defaults ~0.25 for track position)
- P_rolling = Crr × m × g × v (Crr ~0.002 for track tyres)
- Assumed constants with option for advanced users to override
- Display as estimated average watts and W/kg

**Data model:** Optional new fields on `profiles`: `rider_weight_kg`, `bike_weight_kg`. Could also use existing data without schema changes by prompting inline.

**Caveats:** Clearly label as estimates. Accuracy depends heavily on CdA and conditions.

---

## 5. British Cycling Standards Comparison

**Value:** Medium — motivational benchmark for UK riders.

**Description:** Show how recorded times compare to British Cycling category standards (Cat A through E) for each event and age group.

**Implementation:**
- Source BC published standards tables (publicly available)
- Store as static JSON keyed by event, gender, age group
- Show category badge next to PB times (e.g., "Cat B" with a coloured indicator)
- Show gap to next category up as a target

**Data model:** Static reference data. No schema changes.

---

## 6. Training Calendar & Load Tracking

**Value:** Medium — helps prevent overtraining and plan sessions.

**Description:** Weekly/monthly calendar view showing training sessions. Each session can include RPE (Rate of Perceived Exertion, 1-10 scale), duration, and notes. Shows weekly load trends.

**Implementation:**
- Calendar UI with session markers
- RPE input per session (1-10 scale)
- Weekly load = sum of (RPE × duration) — standard TRIMP-style metric
- Colour-code weeks by load (green/amber/red)
- Alert when load spikes >30% week-over-week

**Data model:** New table `training_sessions` with columns: `id`, `user_id`, `date`, `duration_minutes`, `rpe`, `notes`, `session_type`. Or extend `lap_sessions` with optional `rpe` and `duration_minutes` fields.

---

## 7. Gear Comparison Tool

**Value:** Medium-Low — useful but niche.

**Description:** Side-by-side comparison of two gear setups. For each, show speed at various cadences (80-130 RPM in 5 RPM steps), gear inches, development, and skid patches.

**Implementation:**
- Select two saved gear setups or enter ad-hoc values
- Table with cadence rows, two columns showing speed for each setup
- Highlight the crossover point where one setup becomes faster
- Uses existing `calculateGearRatio`, `calculateGearInches`, `calculateDevelopment` from `src/lib/calculations.ts`

**Data model:** No schema changes — uses existing chainrings/sprockets data.

---

## 8. Community Benchmarks (Anonymous Percentile Rankings)

**Value:** Low (requires scale) — most impactful with a larger user base.

**Description:** Opt-in anonymous percentile rankings. Users who enable `share_data_enabled` in their profile contribute anonymised times to a community pool. See where your PB sits (e.g., "Top 25% for Flying 200m").

**Implementation:**
- Aggregate anonymised PBs per event type into a `community_benchmarks` materialised view or edge function
- Calculate percentile for the current user's PB
- Display as a percentile bar or ranking
- Strict privacy: only aggregated stats exposed, individual data never shared

**Data model:** Uses existing `profiles.share_data_enabled` flag. May need a Supabase Edge Function or database view for aggregation. RLS policies must ensure users cannot query individual records.

**Prerequisites:** Sufficient user base to make percentiles meaningful (50+ active users per event type).

---

## Implementation Notes

- Features 1-3 and 5 are pure frontend — no backend changes required
- Feature 4 needs optional profile fields but can work without them
- Feature 6 requires a new table and migration
- Feature 7 reuses existing calculation utilities
- Feature 8 requires backend aggregation and careful RLS design
- All features should be behind feature flags or progressive disclosure to avoid overwhelming the UI
