import os
import time


process_name_1 = "node index.js"
process_name_2 = "sudo node token_server.js"

# def sudo_command(command):
#     print('echo %s|sudo -S %s' % (, command))

while True:
    tmp = os.popen("ps -Af").read()
    now = time.asctime(time.localtime())
    if process_name_1 not in tmp:
        os.system(process_name_1)
        print(process_name_1 + " is restarted at " + now)
    if process_name_2 not in tmp:
        sudo_command(process_name_2)
        print(process_name_2 + " is restarted at " + now)
    time.sleep(1)