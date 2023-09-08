#!/bin/bash

key_file='~/.ssh/pelab.pem'
remote_user='ubuntu'
remote_host='3.215.154.164'
remote_path='/data/www/im.pelab.link/'
tar_file='dist.tar.gz'
deploy_dir='plat'

# 开始上传
function start_upload() {
    pnpm build

    if [[ "$?" != "0" ]]; then
        echo "上次执行发生错误"
        exit
    fi

    echo "打包文件准备上传 ..."
    tar czvf $tar_file dist

  if [[ "$1" == "xjr" ]]; then
    remote_path="/data/www/cai.pelab.link/"
  fi

  echo "上传文件 -> ($key_file - $remote_path - $remote_path)..."
    scp -i $key_file ./${tar_file} ${remote_user}@${remote_host}:${remote_path}

    echo "删除备份文件"
    rm -rf ${tar_file}

    # 登录 -> 删掉原目录 -> 解压 -> 覆盖原目录 -> 删除源文件
    ssh -i $key_file ${remote_user}@${remote_host} > /dev/null 2>&1 << COMMAND
        cd $remote_path
        if [[ -d web-plat ]]; then
            rm -rf web-plat
        fi
        if [[ -e dist.tar.gz ]]; then
            tar zxvf dist.tar.gz
            mv dist web-plat
            rm -rf dist.tar.gz
        fi
        exit
COMMAND
    echo "上传文件发布完成"
}

# main
start_upload $@
