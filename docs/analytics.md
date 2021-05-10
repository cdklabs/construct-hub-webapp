# Construct Hub Web Application Analytics

The construct hub web application is designed to help users find and interact with construct libraries.

In order for its operators to understand whether it indeed serves its purpose, the application offers an analytics
mechanism to extract insights from the traffic it sees.

This document describes that mechanism, detailing how, why, and what can be recorded.

## Declaration of Intent

As a general tenet, we are not interested in identifying individual user traffic. That is, it will not be possible to say which user
searched or interacted with which construct. All we are interested in is aggregative stats to help improve the experience as a whole.

## Recorded Data

To understand which data should be recorded, we work backwards from the questions we'd like to ask it.
For each question, we explain why are we asking it, and which metrics are needed in order to answer it.

> Metrics are denoted using the common dot notation. It merely serves as a concise way to refer to measurements,
> and does not infer any technical meaning. 

### Are users satisfied with the hub?

**Why:** The overall experience with the hub should be positive.

To answer this, we need to understand whether existing users are abandoning the hub, or keep using it.
Normally this is done by making sure that the amount of daily active users doesn't decrease over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to the hub, assuming
that individual user traffic doesn't have a large variance.

**Required metrics:**

- `visits.hub`: Number of distinct visits to the hub. (main page + package pages)

### Are people aware of the hub?

**Why:** The hub should serve the entire ecosystem and consistently attract new users.

To answer this, we need to understand whether new people are discovering the hub.
Normally this is done by making sure that the amount of daily active users increases over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to the hub, assuming
that individual user traffic doesn't have a large variance.

**Required metrics:**

- `visits.hub`: Number of distinct visits to the hub. (main page + package pages)

### Are users satisfied with the package pages?

**Why:** Continuous operation of construct libraries requires a reliable and clear source of documentation. This is offered by the specific package pages of the hub.
We want to make sure users find it helpful.

To answer this, we need to understand whether existing users are abandoning the package pages, or keep using it.
Normally this is done by making sure that the amount of daily active users doesn't decrease over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to package pages, assuming
that individual user traffic doesn't have a large variance.

Note that in this case, we are not interested in users who stumble upon a package page during a search, but rather users who intentionally visit the package
page to help them operate the construct library.

**Required metrics:**

- `visits.packages.<package>`: Number of distinct and direct visits to a `<package>` page.

### Are people aware of package pages?

**Why:** Package pages should serve the entire ecosystem and consistently attract new users.

To answer this, we need to understand whether new people are discovering the package pages.
Normally this is done by making sure that the amount of daily active users increases over time.
Since we don't identify individual users, we approximate by looking at the total number of distinct visits to package pages, assuming
that individual user traffic doesn't have a large variance.

Note that in this case, we are not interested in users who stumble upon a package page during a search, but rather users who intentionally visit the package
page to help them operate the construct library.

**Required metrics:**

- `visits.packages.<package>`: Number of distinct and direct visits to a `<package>` page.

### Are users satisfied with the search experience?

**Why:** Search is one of the core capabilities the hub offers. A poor search experience will likely cause users to discover less construct libraries,
and will hurt the ecosystem.

To answer this question, we first need to define what a good experience is. Effectiveness of search engines is measured by the
engagement of users with the search results. In our case, a successful engagement will result in the installation of a construct library.

Since package installation doesn't happen via the hub, this is impossible to deterministically detect.
Nevertheless, we approximate by making the following assertions:

- A user who clicked on the *Copy installation instructions* button, installed the package.
- A user who spent more than X time on the package page following a search, installed the package.

Tracking individual requests is not sufficient to detect these interactions. For example, a user who directly visits a package page should not be counted.
This means we need to track user sessions as a whole. Specifically, we want to detect the following user journey:

*search* --> *select* --> *install*

If we see that a significant percentage of search journeys don't end in an install, we need to take corrective actions.
For that, we also want to identify which search phrases didn't result in an installation so we can investigate why.

**Required metrics:**

- `journeys.search.success`: Number of journeys that start with a search query, and end in an install.
- `journeys.search.phrases.<phrase>.fail`: Number of journeys that searched for `phrase` and didn't end in an install.

### Which constructs are missing from the ecosystem?

**Why:** We want to make sure users are able to use construct libraries for all their application needs.
By detecting missing constructs, we can either explicitly act, or encourage the community to act in order to fill those gaps.

To answer this, we want to identify hot search phrases that don't return any hits. This can help detect entirely new domains that aren't being covered but should,
as these will likely not manifest as feature requests in any of the existing construct repositories. For example, if we see `docker-compose` is being searched a lot,
we can conclude that the community is looking for `docker-compose` related constructs.

**Required metrics:**

- `search.phrases.<phrase>`: Number of search queries for `phrase`.

## High Level Design

TBD