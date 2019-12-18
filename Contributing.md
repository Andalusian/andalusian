# Contributing to Andalusian

When it comes to open source, there are many different kinds of contributions that can be made, all of which are valuable. Below are a few guidelines that should help you as you prepare your contribution.

## Think You Found a Bug?
Please conform to the issue template and provide a clear path to reproduction with a code example. Best is a pull request with a failing test. Next best is a link to CodeSandbox or repository that illustrates the bug.

## Proposing New or Changed API?
Please provide thoughtful comments and some sample code. Proposals without substance will be closed. It's generally a good idea to open an issue for the proposal first before working on the implementation and submitting a pull request.

## Issue Not Getting Attention?
If you need a bug fixed and nobody is fixing it, it is greatly appreciated if you provide a fix for it. Issues with no activity for 60 days will be automatically closed, with a warning 7 days before closing.

## Making a Pull Request?
Pull requests need only the 👍 of two or more collaborators to be merged; when the PR author is a collaborator, that counts as one.

## Tests
All commits that fix bugs or add features need a test.
<note>Do not merge code without tests.</note>

## Docs + Examples
All commits that change or add to the API must be done in a pull request that also updates all relevant examples and docs.

## Setup
The following steps will get you setup to contribute changes to this repo:

1. Fork the repo (click the Fork button at the top right of this page)
2. Clone your fork locally
*# in a terminal, cd to parent directory where you want your clone to be, then git clone https://github.com/<your_github_username>/andalusian.git*
*cd andalusian*
3. Install dependencies and build. Andalusian uses yarn. If you install using npm, unnecessary package-lock.json files will be generated.
*npm install*
*npm run build*
*npm start*

## Testing
Calling npm run test from the root directory will run tests.

*# run all tests*
*npm run test*
