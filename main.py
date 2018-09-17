import os
import dawg

def getboard():
    f =open('board.txt','r')
    stringboard = f.read()
    f.close()
    global boardArray
    boardArray = stringboard.split('\n')

def getrack():
    f=open('rack.txt','r')
    global stringRack
    stringRack = f.read()
    f.close()

def laodDist():
    f = open('dictionary.txt','r')
    global dictArray 
    dictArray = (f.read()).split('\n')
    f.close()

if __name__ == "__main__":
    getboard()
    getrack()
    laodDist()
    
    