
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** heatmap
- **Date:** 2026-04-20
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Log in successfully and land on the map
- **Test Code:** [TC001_Log_in_successfully_and_land_on_the_map.py](./TC001_Log_in_successfully_and_land_on_the_map.py)
- **Test Error:** TEST FAILURE

Login did not work — the provided valid credentials were not accepted and the app stayed on the login screen.

Observations:
- The login page displays a red error message: "Akun anda belum terdaftar" (Your account is not registered) after submitting admin@example.com / admin123.
- The page remained on the login screen with the email and password still filled (no navigation to the map view).
- The successful post-login landing page (map view) was not reached; no map or dashboard content loaded.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/d7e8621b-0390-4211-a08f-0e5b91df4136
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Log out from map and return to login
- **Test Code:** [TC002_Log_out_from_map_and_return_to_login.py](./TC002_Log_out_from_map_and_return_to_login.py)
- **Test Error:** TEST FAILURE

Logging in did not work — the valid credentials were submitted but the app did not navigate to the map view, so logout cannot be tested.

Observations:
- After submitting admin@example.com / admin123 the page remained on the login screen (no map view appeared).
- The login form (email, password, and 'Masuk' button) stayed visible and active after multiple submit attempts.
- No successful navigation or confirmation that the user is authenticated was observed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/4a44c9d4-1cc9-4395-b0f1-1d1c502000ad
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 From login, reach the map after signing in
- **Test Code:** [TC003_From_login_reach_the_map_after_signing_in.py](./TC003_From_login_reach_the_map_after_signing_in.py)
- **Test Error:** TEST BLOCKED

The test cannot complete because the provided account is not registered, preventing sign-in and access to the map view.

Observations:
- The login page remains displayed with the visible error 'Akun anda belum terdaftar'.
- After submitting valid-looking credentials (admin@example.com / admin123) the app did not navigate to the map view.
- Email and password inputs are still present with those values on the login form.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/e8412659-e484-408c-9751-f6cc061e3161
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Navigate across main pages while authenticated
- **Test Code:** [TC004_Navigate_across_main_pages_while_authenticated.py](./TC004_Navigate_across_main_pages_while_authenticated.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the login cannot complete because the provided credentials appear unregistered.

Observations:
- After submitting valid credentials (admin@example.com / admin123) the login page shows the red message: "Akun anda belum terdaftar".
- The app stayed on the login screen and the main navigation (Map, Stores, Admin, Settings) never appeared.
- Multiple login attempts were performed (3 attempts) with the same result.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/f4aee8ca-8a31-44fe-a0c5-f64a46694dad
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Add a new store and see it in the list
- **Test Code:** [TC005_Add_a_new_store_and_see_it_in_the_list.py](./TC005_Add_a_new_store_and_see_it_in_the_list.py)
- **Test Error:** TEST FAILURE

The add-store (create new store) UI could not be opened, so I could not create and verify a new store.

Observations:
- Clicking the add-store icon (element index 610) and other related controls did not open any add-store form or modal.
- The stores page displays existing stores but there is no visible UI to create a new store.
- Multiple attempts (3) to open the add-store UI were made with no effect.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/b5fb029b-4d6b-402c-80fc-7b231eab8b74
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Edit an existing store and see updated details
- **Test Code:** [TC006_Edit_an_existing_store_and_see_updated_details.py](./TC006_Edit_an_existing_store_and_see_updated_details.py)
- **Test Error:** TEST BLOCKED

The test cannot continue because the app did not complete login and the dashboard (Stores area) is unreachable.

Observations:
- The login form remained on screen with email=admin@example.com and password populated after multiple submit attempts.
- The submit button showed a loading/spinner state but the page did not navigate to the dashboard or show an error message.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/d00ad7ba-dbf9-40cd-942f-17e562e4e2e2
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Search stores and view matching results
- **Test Code:** [TC007_Search_stores_and_view_matching_results.py](./TC007_Search_stores_and_view_matching_results.py)
- **Test Error:** TEST FAILURE

Unable to sign in — the login form remained visible after submitting valid credentials.

Observations:
- The login page still shows the email and password fields populated (admin@example.com / admin123).
- Clicking 'Masuk' multiple times did not navigate away and the button showed a loading spinner in the screenshot.
- No error message or indication was presented explaining why sign-in did not complete.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/a1551b60-9758-441c-bbe4-65fcbf42a4db
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Delete a store and confirm it is removed
- **Test Code:** [TC008_Delete_a_store_and_confirm_it_is_removed.py](./TC008_Delete_a_store_and_confirm_it_is_removed.py)
- **Test Error:** TEST FAILURE

The application does not provide a visible control to delete a store from the store list or the opened store detail, so the test to delete a store cannot be completed.

Observations:
- The store detail modal for 'Toko Hasbiansyah' opened but contains only image/display controls and no 'Hapus'/'Delete'/'Remove' action.
- Store cards show controls labeled (visually) as 'Gambar', 'Bagikan', and 'Navigasi' and the only interactive element index available on the page is [794] (which opens the card); no delete button index is present.
- No confirmation or deletion dialog text was found on the page.

Additional details:
- Currently selected store name: 'Toko Hasbiansyah'.
- Visible per-store controls (textual): Gambar, Bagikan, Navigasi. No delete/remove/hapus item.
- Interactive element index observed related to the opened card: [794] <button />.

Because the UI does not expose a delete/remove control for stores, the required verification (delete a store and confirm it no longer appears) cannot be performed through the available interface. Please add a per-store delete action (or a store settings page with delete) and re-run this test.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/f96af254-c757-44ad-a779-166e40d0036f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 View global heatmap and summary statistics as admin
- **Test Code:** [TC009_View_global_heatmap_and_summary_statistics_as_admin.py](./TC009_View_global_heatmap_and_summary_statistics_as_admin.py)
- **Test Error:** TEST BLOCKED

The admin dashboard could not be reached because the provided admin account appears to be unregistered. The login form returns an 'Akun anda belum terdaftar' message and the page stays on the login screen.

Observations:
- After submitting the valid-looking credentials (admin@example.com / admin123) the app remained on the login page and showed the red message 'Akun anda belum terdaftar'.
- The email and password inputs are populated, and the submit button was clickable, but no dashboard or heatmap elements loaded.
- No alternative navigation to the dashboard was available from the current UI without a successful login.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/40c026d2-73be-4285-8f48-f2ce7d44ddb6
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Add a new user with valid details
- **Test Code:** [TC010_Add_a_new_user_with_valid_details.py](./TC010_Add_a_new_user_with_valid_details.py)
- **Test Error:** TEST BLOCKED

I could not complete the test because an admin session is required to create a user via the admin UI, and I could not obtain or create an admin account through the app.

Observations:
- The registration form shows the error: "User already exists. Use another email." for admin@example.com.
- Login attempts with admin@example.com / admin123 failed (the app indicated the account is not registered).
- Without a logged-in admin, there is no visible path to the admin/users page to create a new user.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/9cf2786b-6355-45a5-be13-3fba68c2501f
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Update global heatmap and statistics using dashboard controls
- **Test Code:** [TC011_Update_global_heatmap_and_statistics_using_dashboard_controls.py](./TC011_Update_global_heatmap_and_statistics_using_dashboard_controls.py)
- **Test Error:** TEST BLOCKED

The test cannot continue because the provided admin credentials are not registered on the application.

Observations:
- After submitting valid-looking credentials the login page showed a red message: 'Akun anda belum terdaftar'.
- The login form remains visible with email='admin@example.com' and password='admin123'.
- The admin dashboard could not be reached, so dashboard controls cannot be tested.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/42066276-6f3c-4f9f-a5aa-ee35351dab81
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Edit an existing user and see changes reflected in the list
- **Test Code:** [TC012_Edit_an_existing_user_and_see_changes_reflected_in_the_list.py](./TC012_Edit_an_existing_user_and_see_changes_reflected_in_the_list.py)
- **Test Error:** TEST BLOCKED

The test cannot continue because the admin account appears not to be registered or allowed to sign in.

Observations:
- The login page displays a red alert: 'Akun anda belum terdaftar'.
- The page remains on /login with the email and password fields visible and filled (admin@example.com / admin123).
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/530e75c3-1b60-401a-8138-f28fbf89ec41
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Search for a user from the admin dashboard
- **Test Code:** [TC013_Search_for_a_user_from_the_admin_dashboard.py](./TC013_Search_for_a_user_from_the_admin_dashboard.py)
- **Test Error:** TEST BLOCKED

The admin dashboard cannot be reached because the provided admin credentials are not recognized by the application.

Observations:
- After submitting admin@admin.com / admin123 the login form stayed on screen and a red alert 'Akun anda belum terdaftar' is shown.
- The page still displays the email and password inputs and the 'Masuk' button; there was no navigation to an admin/dashboard page.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/4c0d00a2-0179-42f0-9bcf-e93a39bd64c1
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Delete a user and verify it is removed
- **Test Code:** [TC014_Delete_a_user_and_verify_it_is_removed.py](./TC014_Delete_a_user_and_verify_it_is_removed.py)
- **Test Error:** TEST FAILURE

The application does not expose a user-management (admin/users) feature that would allow creating or deleting users, so I cannot verify that an admin can delete a user.

Observations:
- Left navigation only shows 'Peta' and 'Daftar Toko' (no 'Users' or 'Pengguna' menu item).
- The Pengaturan (Settings) page displays only the current admin profile and a logout control; there is no users list, CRUD controls, or any user-management interface.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/ce3584dc-2f0c-412d-a992-f4c0b97546f2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Navigate between admin dashboard and stores via app navigation
- **Test Code:** [TC015_Navigate_between_admin_dashboard_and_stores_via_app_navigation.py](./TC015_Navigate_between_admin_dashboard_and_stores_via_app_navigation.py)
- **Test Error:** TEST BLOCKED

The admin account could not be used to log in, preventing the test from proceeding to the dashboard and stores pages.

Observations:
- The login page displays the message "Akun anda belum terdaftar" (account not registered).
- Repeated submit attempts (clicks and Enter) and a direct navigation to /admin/dashboard did not authenticate or navigate away from /login.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/cb973f86-9d6a-4515-bdf3-c234390d2f61
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Persist admin dashboard filter selection during navigation within session
- **Test Code:** [TC016_Persist_admin_dashboard_filter_selection_during_navigation_within_session.py](./TC016_Persist_admin_dashboard_filter_selection_during_navigation_within_session.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — login is required to perform the dashboard filter persistence test but the provided credentials do not allow access.

Observations:
- The login page showed an inline error: "Akun anda belum terdaftar".
- After submitting credentials admin@admin.com / admin123 the app remained on the login screen and did not navigate to the dashboard.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/bb724bac-9cd7-41a2-8eef-db83a844f6de
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Reject incorrect credentials
- **Test Code:** [TC017_Reject_incorrect_credentials.py](./TC017_Reject_incorrect_credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/cfbe2b19-137c-49b4-a19e-403a51a64279
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Prevent saving a store when required fields are missing
- **Test Code:** [TC018_Prevent_saving_a_store_when_required_fields_are_missing.py](./TC018_Prevent_saving_a_store_when_required_fields_are_missing.py)
- **Test Error:** TEST BLOCKED

The test cannot continue because I could not log in to the application using the provided credentials. Without access to the authenticated area I cannot reach the stores management page to verify the store form validation.

Observations:
- After submitting valid-looking credentials (admin@example.com / admin123) the page remained on the /login screen and did not navigate to a dashboard.
- No authenticated navigation or stores management links became available; only the login form is visible.
- The initial login attempt was blocked by browser HTML5 email validation when the email 'admin' (missing '@') was used.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/f070b934-a8ad-4717-bc0b-adab9adb02e6
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Show required-field validation on empty login submit
- **Test Code:** [TC019_Show_required_field_validation_on_empty_login_submit.py](./TC019_Show_required_field_validation_on_empty_login_submit.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/3fd266d6-cdc1-46a4-9b8c-df5eb108da61
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Admin dashboard handles empty-data state gracefully
- **Test Code:** [TC020_Admin_dashboard_handles_empty_data_state_gracefully.py](./TC020_Admin_dashboard_handles_empty_data_state_gracefully.py)
- **Test Error:** TEST BLOCKED

The feature could not be reached — the admin account cannot access the dashboard because the credentials are not registered.

Observations:
- After submitting valid credentials, the login form showed an inline error: "Akun anda belum terdaftar".
- The page remained on /login with the login form visible and no navigation to the dashboard.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/865ecf46-ec05-4c87-8c83-7a1ada340809
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Block creating a user when required fields are missing
- **Test Code:** [TC021_Block_creating_a_user_when_required_fields_are_missing.py](./TC021_Block_creating_a_user_when_required_fields_are_missing.py)
- **Test Error:** TEST BLOCKED

The test cannot proceed because login to the application failed and the admin interface cannot be reached.

Observations:
- The login page displays the message 'Akun anda belum terdaftar' after submitting the provided credentials.
- The email and password fields remain visible and the app did not navigate to a dashboard or admin area.
- Cannot access admin/users to test the add-user form validation because authentication is not successful.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f942164e-3442-4bdd-a776-eca8751d1531/f1900dac-e8f9-4863-bb99-dc032205e118
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **9.52** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---