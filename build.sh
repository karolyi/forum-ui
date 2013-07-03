#!/bin/bash

grunt build;git add -A;gca;git subtree push --prefix dist origin production;gp -v
