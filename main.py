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
    global stringRack2
    stringRack2 = f.read()
    f.close()

def laodDist():
    f = open('dictionary.txt','r')
    dictArray = (f.read()).split('\n')
    global completion_dawg
    completion_dawg = dawg.CompletionDAWG(dictArray)
    f.close()

def crossCheck(char,row,x):
    nword = char
    k = row+1
    row-=1
    while row>=0 and boardArray[row][x] != '#':
        nword = boardArray[row][x] + nword
        row-=1
    while k<15 and boardArray[k][x] != '#':
        nword = boardArray[k][x] + nword
        k+=1
    if nword == "SME":
        print(row+1,x+1)
    if nword in completion_dawg:
        return True
    else :
        return False


def checkWord(word,row,x,col,rack,id):
    if x >= 15:
        return
    global possArray
    global possStart
    if x > col and word in completion_dawg and x<15  and boardArray[row][x]=='#':
        if word == "MEMOIRS":
            print(boardArray[row][x],row+1,x+1)
        possArray.append(word)
        if id == 1:
            possStart.append([row,x-len(word),id])
        else:
            possStart.append([x-len(word),row,id])
    if len(rack) ==0 :
        return
    if boardArray[row][x] == '#':
        for i,char in enumerate(rack):
            word = word + char
            if completion_dawg.has_keys_with_prefix(word) and crossCheck(char,row,x):
                rack = rack[:i] + rack[i+1:]
                checkWord(word,row,x+1,col,rack,id)
                rack = rack[:i]+char+rack[i:]
            word = word[:len(word)-1]
    else:
        word = word + boardArray[row][x]
        checkWord(word,row,x+1,col,rack,id)
        
      
def findPlace(id):
    for i,row in enumerate(boardArray):
        for j,element in enumerate(row):
            if element!='#' :
                for x in range(max(j-7,0),min(j,14)):
                    checkWord("",i,x,j,stringRack2,id)
                    if i+1<15:
                        checkWord("",i+1,x,j,stringRack2,id)
                    if i-1>=0:
                        checkWord("",i-1,x,j,stringRack2,id)
                    

if __name__ == "__main__":
    getboard()
    getrack()
    print(stringRack2)
    global possArray
    possArray = []
    global possStart
    possStart = []
    laodDist()
    findPlace(1)
    boardArray = [*zip(*boardArray)]
    findPlace(2)
    for i,strr in enumerate(possArray):
        if possArray[i] == "MEMOIRS":
            print(possArray[i],possStart[i][0]+1,possStart[i][1]+1,possStart[i][2])
