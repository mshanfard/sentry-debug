This project is to demo a bug where upgrading to the latest `@sentry/browser` or any version past 5.19.0 causes tests to take longer.

To reproduce the bug, follow these steps:
1. Clone the project using `git clone https://github.com/mshanfard/sentry-debug.git`.
2. `cd` into the project and run `nvm use` then `yarn install`.
3. Run the test using `yarn test --maxWorkers=2`. Notice it takes 5-6 seconds to complete.
4. Change `package.json` to have the latest `@sentry/browser` version. You do this by replacing `5.19.0` with `*`.
5. Run `yarn install`.
6. Run the test again using `yarn test --maxWorkers=2`. Notice it takes over 45 seconds to complete.

*Note:*  All the tests are the same test repeated over and over in different files to demonstrate the set-up that causes tests to start slowing down.