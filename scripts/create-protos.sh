#!/bin/bash

proto_dir="/Users/ai/work/im3/chat-protos/protos" 
out_dir="/Users/ai/work/im3/web-admin-platform/src/protos"

protoc -I=${proto_dir}/plat platform.proto \
  --js_out=import_style=commonjs:${out_dir} \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:${out_dir}

# @loicmagne You can use @protobuf-ts and 
# protoc --ts_out ./generated --proto_path "./proto" <protoFilesPaths> command. It works fine with Vite.

