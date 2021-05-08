# Construct-Hub Analytics

This document details the analytics capabilities offered by the construct hub web application.

## What to track

### Traffic Volume

We want to make sure the hub sees consistent and increasing traffic over time. To the end, we track the following metrics:

#### Metrics

#### Insights

### Traffic Quality

We want to make sure users have a productive experience with the hub. Given it is designed to find and operate construct libraries, we define a produtive experience as one of two user journeys:

- A user visits the main page and installs a construct library. We call this the *Install* journey. More concretely, it has the following stops:

  **Visit** --> **Search** --> **Browse** --> **Navigate** --> **Install**

  Since package installation doesn't happen via the hub, there is no bulletproof way for us to determine whether a user actually installed a package or not. Nevertheless, we try to approximate by making the following assertions:

  - A user who clicked on the *Copy installation instructions* button, installed the package.
  - A user who spent more than X time on the package page, installed the package.

- A user visits a specific package page, and stays there to read documenation. We call this the *Operate* journey. More concretely, it has the following stops:

  **Visit** --> **Operate**

  User interaction with the package is hard to determine because most of it will probably be looking at documentation. To that end, we make the following assertion:

  - A user who spent more than X time on the package page, used it to operate the construct.

Quality traffic is defined by the success rate of these journeys.

#### Metrics

##### `journeys.<journey>.stops.<stop>`

This metric describes the final stop of each journey type.

For example, `journeys.search.stops.browse` counts the number of search journeys that
terminated in the *browse* stop, meaning the user did not click on
any search result.

#### Insights

Given this data, we will be able to extract the following insights:

- Are users finding the libraries the're looking for? why not?

  > If most journeys terminate in the browse/navigate stop, it can either mean our search results aren't good enough, or that the relevant constructs don't exist.

- Do users find the package helpful?

  > If users spend only a few seconds on the package page, it probably means they haven't found what the're looking for.

## High Level Design

TBD