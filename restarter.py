import os
import time

process_name = "node index.js"
while True:
    tmp = os.popen("ps -Af").read()
    if process_name not in tmp:
        now = time.asctime(time.localtime())
        os.system(process_name)
        print(process_name + " is restarted at " + now)
        time.sleep(10)