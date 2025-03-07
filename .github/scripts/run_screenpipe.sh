#!/bin/bash
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export PULSE_SERVER=unix:${XDG_RUNTIME_DIR}/pulse/native
./target/release/skyprompt --disable-telemetry --debug > skyprompt_output.log 2>&1 &
SKYPROMPT_PID=$!
echo $SKYPROMPT_PID > skyprompt.pid
# Check resource usage every 10 seconds, for 1 minute
for i in {1..6}
do
   sleep 10
   ps -p $SKYPROMPT_PID -o %cpu,%mem,cmd
done
