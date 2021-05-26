#!/bin/bash
#------------------------------------------------------------------------
# downloads jsii assemblies of select packages so they can be used
# during development.
#------------------------------------------------------------------------
set -euo pipefail
scriptdir=$(cd $(dirname $0) && pwd)

target=${scriptdir}/../public/packages

function import_package {
  name=$1
  version=$2

  workdir=$(mktemp -d)

  cd ${workdir}

  assembly_dir=${target}/${name}@${version}
  assembly_file=${assembly_dir}/jsii.json

  if [ ! -f ${assembly_file} ]; then
    echo "Fetching assembly for ${name}@${version}"
    npm pack ${name}@${version}
    tar -zxvf ${name}-${version}.tgz

    assembly_dir=${target}/${name}@${version}
    mkdir -p ${assembly_dir}

    # this is the path the webapp hits to retrieve assemblies.
    echo "Copying to ${assembly_file}"
    cp package/.jsii ${assembly_file}
  else
    echo "Assembly ${assembly_file} already exists."
  fi
}

import_package "aws-cdk-lib" "2.0.0-rc.4"
import_package "constructs" "10.0.0"
