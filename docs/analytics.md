# Construct Hub Web Application Analytics

The construct hub web application is designed to help users find and interact with construct libraries.

In order for its operators to understand whether it indeed serves its purpose, the application offers an analytics
mechanism to extract insights from the traffic it sees.

This document describes that mechanism, detailing how, why, and what can be recorded.

## Recorded Data

To understand which data should be recorded, we introduce a few questions we'd like to ask.
For each question, we explain why are we asking it, and which measurements are needed in order to answer it.

### Are users satisfied with the hub?

The overall experience with the hub should be positive.

To answer this, we need to understand whether existing users are abandoning the hub, or keep using it.
Normally this is done by making sure that the amount of daily active users doesn't decrease over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to the hub, assuming
that individual user traffic doesn't have a large variance.

**Required metrics:**

- `visits.hub`: Number of distinct visits. (main page + package pages)

### Are people aware of the hub?

The hub should serve the entire ecosystem, as well as consistently attract new users.

To answer this, we need to understand whether new people are discovering the hub.
Normally this is done by making sure that the amount of daily active users increases over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to the hub, assuming
that individual user traffic doesn't have a large variance.

**Required metrics:**

- `visits.hub`: Number of distinct visits. (main page + package pages)

### Are users satisfied with the package pages?

Continuous operation of construct libraries requires a reliable and clear source of documentation. This is offered by the specific package pages of the hub.
We want to get a sense whether users find it helpful.

To answer this, we need to understand whether existing users are abandoning the package pages, or keep using it.
Normally this is done by making sure that the amount of daily active users doesn't decrease over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to package pages, assuming
that individual user traffic doesn't have a large variance.

Note that in this case, we are not interested in users who stumble upon a package page during a search, but rather users who intentionally visit the package
page to help them operate the construct library.

**Required metrics:**

- `visits.packages.<package>`: Number of distinct and direct visits to the `<package>` page.

### Are people aware of package pages?

Package pages should serve the entire ecosystem, as well as consistently attract new users.

To answer this, we need to understand whether new people are discovering the package pages.
Normally this is done by making sure that the amount of daily active users increases over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to package pages, assuming
that individual user traffic doesn't have a large variance.

Note that in this case, we are not interested in users who stumble upon a package page during a search, but rather users who intentionally visit the package
page to help them operate the construct library.

**Required metrics:**

- `visits.packages.<package>`: Number of distinct and direct visits to the `<package>` page.

### Are users satisfied with the search experience?

Search is one of the core capabilities the hub offers. A poor search experience will likely cause users to discover less construct libraries,
and will hurt the ecosystem. To answer this question, we first need to define what a good experience is.

Effectiveness of search engines is measured by the engagement of users with the search results.
In our case, a successful engagement will result in the installation of a construct library.

Since package installation doesn't happen via the hub, this is impossible to deterministically detect.
Nevertheless, we approximate by making the following assertions:

- A user who clicked on the *Copy installation instructions* button, installed the package.
- A user who spent more than X time on the package page following a search, installed the package.

Tracking individual requests is not sufficient to detect these interactions. For example, a user who directly visits a package page should not be counted.
This means we need to track user sessions as a whole. Specifically, we want to detect the following user journey:

*search* --> *select* --> *install*

If we see that most search journeys terminate at the *install* phase, we conclude users are finding what they're looking.

To improve the search experience, we want to identify which search phrases didn't result in an installation.

**Required metrics:**

- `journeys.search.success`: Number of journeys that start with a search query, and end in an install.
- `journeys.search.phrases.<phrase>.fail`: Number of journeys that searched for `phrase` and didn't end in an install.

### Which constructs are missing from the ecosystem?

By detecting missing constructs, we can either explicitly act, or encourage the community to act in order to fill those gaps.

To answer this, we want to identify hot search phrases that don't return any hits. For example, if we see `docker-compose` is being searched a lot,
we can conclude that the community is looking for a `docker-compose` related constructs. This can help detect entirely new domains that aren't being covered but should,
as these will likely not manifest as feature requests in any of the existing construct repositories.

**Required metrics:**

- `search.phrases.<phrase>`: Number of search queries for `phrase`.

## High Level Design

TBD