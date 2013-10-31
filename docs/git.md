Getting Started With Git
========================

[Git][git] was created by Linus Torvalds, the creator of Linux, and is a
distributed version control system. When it comes to Git there are already
many guides that are much better than anything I am going to be able to write,
so I am going to try to point you to some quick resources to get you
up to speed.

Getting started, I highly recommend reading through most of this conceptually 
[visual tutorial][git-concepts-tut] first. The official 
[git documentation][git-docs] is also available. There is also an official 
[Git Tutorial][git-tutorial] to get started with as well.

Overview of Major Commands
--------------------------
 * `git init` - ([doc][git-init]) - Initializes a new git repository in the
      current working directory
 * `git add` - ([doc][git-add]) - Add modified items from the working tree to 
      the local staging area
 * `git commit` - ([doc][git-commit]) - Records changes from the staging area to 
      the repository, creating a new snapshot of the repository
 * `git status` - ([doc][git-commit]) - View the status of the working tree
 * `git remote` - ([doc][git-remote]) - Manage set of remote repositories
 * `git clone` - ([doc][git-clone]) - Copies a remote repository into a local 
      directory
 * `git push` - ([doc][git-push]) - Push changes up to a remote repository
 * `git pull` - ([doc][git-pull]) - Pull changes down from a remote repository

GitHub
------
[GitHub][github] is a service that provides free hosting for public remote git
repositories and paid hosting for private remote git repositories. GitHub builds
on top of the concepts of git by adding the notion of [Forks][github-forks] and
[Pull Requests][github-pull-requests]. GitHub also provides excellent diffs, 
issue tracking, wikis, etc. You will need to follow this 
[tutorial][github-git-setup] for configuring Git to securely work with your
GitHub account.

#### Forks

On GitHub, forking a repository, is essentially just cloning the remote
repository stored by GitHub's servers from one account to another repository
on GitHub's servers for another account. All repositories on github are named
by combination of user account and project name with syntax
`username/projectname`.

#### Pull Requests

Forks are only interesting when considered with the notion of Pull Requests.
Git has the notion of a pull, the command `git pull` is used to pull changes
down from a remote repository, whereas the command `git push` is used to push
changes up to a remote repository. Git does not however have the notion of pull
requests. GitHub allows repositories which have been forked from another
repository (or vice versa) create what is called a pull request. This allows
you to request that others pull in commits you've made to your fork. Pull
requests allow you to send such a request with a message, allows the party
to review the commits and changes made, discuss potential modifications, push
follow-up commits, etc.

#### Organizations

Forks and Pull Requests enable a workflow called the 
[Fork and Pull Model][github-fork-and-pull] which allows each member to each
have their own forked remote repo which they can push to without worrying about
other's changes. There is generally an original remote repo, or organization
repo which changes must be pulled into from the contributor's forked
repositories.

I've used this model in a past project with 6 team members before and I believe
it to be the most flexible setup. There are multiple levels of source control.
You have a local repository which provides source control, you make commits
directly to your local repository, pushing commits up to your fork. I created
a GitHub Organization for our project with the account name AuburnBigEvent. Each
team member on our team will be a member of the Organization with pull rights to
the main repository. You will have pull rights to each of your team mates forked
repositories. You will have pull *and* push rights to your own fork. 

#### Setting Up Team Remotes

You can view the current remotes associated with a local repository by using the
command `git remote -v`. If you only cloned your fork then you should only see
the `origin` remote.

The `origin` remote is the remote repository from which the local repository was
cloned. In our case, `origin` should be your fork on GitHub. You should add each
of your team mates forks as remotes as well so that you can pull changes from
their forks when you wish. You can add a remote for my remote fork by running

    git remote add cory https://github.com/CoryG89/BigEvent

You should also add the main organization repository as the upstream repository

    git remote add upstream https://github.com/AuburnBigEvent/BigEvent

You can now pull changes from any of these remotes by using the command

    git pull remote_name master

The last argument in that command is the branch name. Branches can be used for
dividing work up into individual features and merging them into the master
branch when complete. Many smaller projects with few contributors do not use
feature branches so currently we only have the single master branch. So you'll
probably be pushing and pulling up to master. You can push to your own remoted
GitHub fork by running the command

    git push origin master

#### Example of the Workflow

I am going to use the changes I am making to these markdown documentation files
in the projects `/docs` directory as an example of how the workflow can be used.
I am modifying several of these changes. When I am satisfied enough with what I
have to actually commit the modifications to source control then I need to add
the desired modifications to what's often called staging area. The staging area
basically lets you select part of your working tree (tree modeling your project
directory and any modifications to it) in order to build commits to add.

The general idea here in order to avoid conflicts when merging with team mates
is to build commits that have a single purpose, it can make multiple 
modifications in multiple places in multiple files, but it should be for a
single goal. If I have been working on something other than the documentation
say the `dbman` module in the `server` directory. I don't want to lump those
modifications in with the commit for changing the documentation.

You can view the modifications made to your working tree with the following
command

    git status

If I haven't made any other modifications to my working tree, then I can add
the entire thing to the staging area with the command

    git add .

If I was working on something else, say the `dbman` module, and I wanted to
create a commit for the documentation I could add the specific files individually
or a more give it a more specific pattern

    git add docs/*.md

Once our modification have been added to the staging area, you can then use the
following command to commit the modifications in the staging area to your local
repository

    git commit

At this point you can either create more commits or push your changes up to your
remote forked repository on GitHub:

    git push origin master

If the code is ready to be pushed up to the main repository, you can go to your
fork and click Pull Request in order to submit them for merging into the main 
repo. If other commmits are added to the main repository from other team member
forks then you can pull them down with the command

    git pull upstream master

You could also pull from a remote that pointed to a team members forked
remote repo such as mine

    git pull cory master

Recommended Docs
----------------
 - [Gitolite - Git Concepts Tutorial][git-concepts-tut]
 - [ProfHacker - Forks and Pull Requests][profhacker-forks-pull-requests]
 - [Github - Fork and Pull][github-fork-and-pull]
 - [Github - Resolving Conflicts][github-conflicts]

[git]: http://git-scm.com
[git-docs]: http://git-scm.com/docs
[git-tutorial]: http://git-scm.com/docs/gittutorial
[git-config]: http://git-scm.com/docs/git-config
[git-init]: http://git-scm.com/docs/git-add
[git-add]: http://git-scm.com/docs/git-add
[git-commit]: http://git-scm.com/docs/git-commit
[git-status]: http://git-scm.com/docs/git-status
[git-remote]: http://git-scm.com/docs/git-remote
[git-clone]: http://git-scm.com/docs/git-clone
[git-pull]: http://git-scm.com/docs/git-pull
[git-push]: http://git-scm.com/docs/git-push

[git-concepts-tut]: http://gitolite.com/gcs/index.html

[github]: http://github.com
[github-forks]: https://help.github.com/articles/fork-a-repo
[github-pull-requests]:https://help.github.com/articles/using-pull-requests
[github-conflicts]: https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line
[github-git-setup]: https://help.github.com/articles/set-up-git

[github-fork-and-pull]: https://help.github.com/articles/using-pull-requests#fork--pull

[profhacker-forks-pull-requests]: http://chronicle.com/blogs/profhacker/forks-and-pull-requests-in-github/47753
