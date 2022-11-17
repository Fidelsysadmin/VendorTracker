import os
import time



def main_node_server():
    try:
        
        message = "Main function is call"
        print(message)
        
        time.sleep(10)

        hostname = "http://192.168.1.74:5000" #example 192.168.1.24:5000
        response = os.system("ping -c 1 " + hostname)
        print("Server is up")

        if response == 0:
            message = hostname,+ 'is up!'
            main_node_server()

        else:
            os.system("npm start 192.168.1.74:5000") # put here node js path and npm start screen command
            print("Node server is up")
            main_node_server()

    except Exception as e:
        print("Error is:",e)
        main_node_server()
main_node_server()



# run script command
# screen -d -m python3 python_server_run.py

# For remove screen session

# 1) screen -list

# 2) screen -S 29184 -X quit
