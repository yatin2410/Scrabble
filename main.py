import os
import dawg
from string import ascii_uppercase

def getboard():
    f =open('board.txt','r')
    stringboard = f.read()
    f.close()
    global boardArray
    boardArray = stringboard.split('\n')

def getboardValue():
    f =open('boardValue.txt','r')
    stringboard = f.read()
    f.close()
    global boardValue
    boardValue = stringboard.split('\n')


def getrack():
    f=open('rack.txt','r')
    global stringRack2
    rackArray=(f.read()).split('\n')
    stringRack2 = rackArray[0]
    global rackValues
    rackValues = {}
    for c in ascii_uppercase:
        rackValues[c] = 1
    for i,num in enumerate(rackArray[1]):
        rackValues[stringRack2[i]] = num
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
        nword =  nword + boardArray[k][x] 
        k+=1
    if nword in completion_dawg:
        return True
    else :
        return False


def checkWord(word,row,x,col,rack,id):
    if x == 15 and ((word in completion_dawg) == False):
        return
    global possArray
    global possStart
    if x == 15:
        possArray.append(word)
        if id == 1:
            possStart.append([row,x-len(word),id])
        else:
            possStart.append([x-len(word),row,id])
        return
    if x > col and word in completion_dawg and x<15  and boardArray[row][x]=='#':
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
            if element!='#' and boardArray[i][j-1]=='#' :
                for x in range(max(j-7,0),min(j,14)):
                    checkWord("",i,x,j,stringRack2,id)
                    if i+1<15:
                        checkWord("",i+1,x,j,stringRack2,id)
                    if i-1>=0:
                        checkWord("",i-1,x,j,stringRack2,id)
                    

def costFunc(strr,i,j,id):
    cost = 0
    dw = 0
    tw = 0
    if id == 1:
        for col in range(j,j+len(strr)):
            if boardValue[i][col] == "1" or boardValue[i][col] == "2" or boardValue[i][col] == "3" :
                cost += int(rackValues[strr[col-j]]) * int(boardValue[i][col])
            else:
                cost += int(rackValues[strr[col-j]])
            if boardValue[i][col] == "4":
                dw+=1
            if boardValue[i][col] == "5":
                tw+=1
        cost = cost * (2 ** dw)
        cost = cost * (3 ** tw)

    if id == 2:
        for row in range(i,i+len(strr)):
            if boardValue[row][j] == "1" or boardValue[row][j] == "2" or boardValue[row][j] == "3" :
                cost += int(rackValues[strr[row-i]]) * int(boardValue[row][j])
            else:
                cost += int(rackValues[strr[row-i]])
            if boardValue[row][j] == 4:
                dw+=1
            if boardValue[row][j] == 5:
                tw+=1
        cost = cost * (2 ** dw)
        cost = cost * (3 ** tw)
    return cost


if __name__ == "__main__":
    getboard()
    getrack()
    getboardValue()
    print("Your Rack is : " + stringRack2)
    global possArray
    possArray = []
    global possStart
    possStart = []
    laodDist()
    findPlace(1)
    boardArray = [*zip(*boardArray)]
    findPlace(2)
    mx = -1
    ansIndex = -1
    for i,strr in enumerate(possArray):
        if costFunc(strr,possStart[i][0],possStart[i][1],possStart[i][2]) > mx:
            mx = costFunc(strr,possStart[i][0],possStart[i][1],possStart[i][2])
            ansIndex = i
    if(possStart[ansIndex][2]==1):
        print(" ---- HORIZONTLY ---- ")
    if(possStart[ansIndex][2]==2):
        print(" ---- VERTICALLY---- ")
    print("Maximum Posible String is " + possArray[ansIndex] + ". Starting is at row "+ str(possStart[ansIndex][0]+1)+" and col at " + str(possStart[ansIndex][1]+1)+" and point is "+str(mx))
