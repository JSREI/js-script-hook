#!/bin/bash

# 热编译好像有点问题，这是一个折中的方案
while true; do
  # 执行 yarn build 命令
  yarn build
  # 等待1秒
  sleep 1
done