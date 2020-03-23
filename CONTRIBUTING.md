# Contribution guidelines

Table of contents
- [How can you contribute?](#how-can-you-contribute)
  - [Help triage issues](#help-triage-issues)
  - [Updating documentation](#updating-documentation)
  - [Help with translations](#help-with-translations)
- [Getting started](#getting-started)
  - [Contribute to the codebase](#contribute-to-the-codebase)
  - [Making changes](#making-changes)
  - [Pull requests](#pull-requests)
    - [Considerations before submitting a pull request](#considerations-before-submitting-a-pull-request)
    - [Each pull request should include](#each-pull-request-should-include)
  - [Closing issues](#closing-issues)
  - [Triage help](#triage-help)

## How can you contribute?
Skylin welcomes contributions of all kinds! You can make a huge impact without writing a single line of code

### Help triage issues
One of the easiest ways to help is to [look through our issues tab](https://github.com/unbilth/skylin/issues)
* Does the issue still happen? Sometimes we fix the problem and don't always close the issue
* Are there clear steps to reproduce the issue? If not, let's find and document some
* Is the issue a duplicate? If so, share the issue that is being duplicated in the conversation
* Making sure issues that are fixed have the appropriate milestone set.

### Updating documentation
Documentation is extremely important. There are lots of areas we can improve:
* Having more clear or up-to-date instructions in the README.
* Helping to propose a way to bring documentation to other languages. Right now, everything is in English
* Improving this document :smile:

### Help with translations
All text being added to Skylin is done initially in English (en-US) and then is translated by real people into other languages.
We're missing translations for many languages and some translations might be incomplete or poor quality.

For everything you'd need to get started, check out https://www.transifex.com/skylin/skylin/ :smile:

## Getting started
* Make sure you have a [GitHub account](https://github.com/join).
* Submit a [ticket](https://github.com/skylin/skylin/issues) for your issue if one does not already exist. Please include the Skylin version, operating system, and steps to reproduce the issue.
* Fork the repository on GitHub.
* For changes to JavaScript files, we recommend installing a [Standard](http://standardjs.com/) plugin for your preferred text editor in order to ensure code style consistency.

### Contribute to the codebase

While logged into your GitHub account, navigate to the [Skylin repository][https://github.com/unbilth/skylin.git] 
and click the 'Fork' button in the upper righthand corner.  Your account now 
has a 'forked' copy of the original repo at 
`https://github.com/<your GitHub username>/Skylin`.

Change to that directory and set up your fork as a git [remote][https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes]:

```bash
$ cd .../Folder/Skylin
# Add your fork as a remote.  Name it whatever is convenient,
# e.g your GitHub username
$ git remote add <remote name> https://github.com/<username>/skylin.git
```

### Making changes

There is a few tips we can suggest:

* Make a new branch for your work. It helps to have a descriptive name, like `fix-fullscreen-issue`.
* Make commits in logical units.
* New features and most other pull requests require a new test to be written before the pull request will be accepted. Some exceptions would be a tweak to an area of code that doesn't have tests yet, text changes, build config changes, things that can't be tested due to test suite limitations, etc.
* Use GitHub [auto-closing keywords](https://help.github.com/articles/closing-issues-via-commit-messages/) in the commit message, and make the commit message body as descriptive as necessary.
* Run the tests by running `npm run test` from the `src` directory
* JavaScript unit tests can be ran from the `src/components/component` and `src/containers/containers` directory using `npm run test`

### Pull requests

Once you've tested your new code and pushed changes to your fork, navigate to
your fork at `https://github.com/<username>/Skylin` in your browser.  
Switch to the branch you've made changes on by selecting it from the list on 
the upper left.  Then click 'New pull request' on the upper right.

Once you have made the pull request, we will review your code.  We will reject 
code that is unsafe, difficult to read, or otherwise violates the conventions.


#### Considerations before submitting a pull request
Some helpful things to consider before submitting your work
* Did you manually test your new change?
* Does your pull request fix multiple issues? If so, you may consider breaking into separate pull requests.
* Did you include tests?
* If you made a design or layout change, was there a mock-up provided? Do your changes match it?
* If your change affects session or preferences, did you include steps to test? You may also consider manually testing an upgrade.

#### Each pull request should include
* a descriptive title; this gets used in the [release notes](https://github.com/brave/skylin-skylin/blob/master/CHANGELOG.md)
* a short summary of the changes
* a reference to the issue that it fixes
* steps to test the fix (if applicable)
* for design-related changes, it is helpful to include screenshots

Once you submit a pull request, you should tag reviewers and add labels if needed.

### Closing issues

* Issues should be assigned the milestone when the PR is merged.
* If an issue is closed without a fix, because it was a duplicate, or perhaps it was invalid, then any milestone markers should be removed.
* If a bug is not fully fixed after its issue is closed, open a new issue instead of re-opening the existing one (unless the code has been reverted).

### Triage help

* Invalid bugs should be closed, tagged with invalid, or a comment should be added indicating that they should if you do not have permission.
* Asking for more detail in an issue when it is needed is helpful.
* Adding applicable labels to an issue is helpful.
* Adding and finding duplicates, and linking them together is helpful.
* Creating tracking issues for an area of work with multiple related issues is helpful.
* Calling out things which seem important for extra attention is helpful.
* Improving steps to reproduce is helpful.
* Testing and adding a comment with "Could not reproduce" if an issue seems obscure is helpful.
* Testing open pull requests.
* You can be granted write permission if you've helped a lot with triage by pinging @unbilth.
* Helping make sure issues have a clear and understandable name (ex: not something like "Skylin is broken").
* The first comment in an issue ideally would have a clear description of the issue and describe the impact to users. Asking folks for screenshots, steps to reproduce, and more information is highly recommended so that the issue is as clear as possible.
* If the issue is a duplicate, please let the issue creator know in a polite way how they can follow and track progress of the parent issue.