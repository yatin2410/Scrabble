import os
import dawg
from string import ascii_uppercase
import string
import random
import sys

def getboard():
    f =open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'r')
    stringboard = f.read()
    f.close()
    global boardArray
    boardArray = stringboard.split('\n')
    global boardArrayPrev
    boardArrayPrev = boardArray

def getboard1():
    f =open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'r')
    stringboard = f.read()
    f.close()
    global boardArray
    boardArray = stringboard.split('\n')


def getboardCopy():
    f =open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'r')
    stringboard = f.read()
    f.close()
    global boardCopy
    boardCopy = stringboard.split('\n')


def getboardValue():
    f =open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/boardValue.txt'),'r')
    stringboard = f.read()
    f.close()
    global boardValue
    boardValue = stringboard.split('\n')


def getrack():
    f=open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/rack.txt'),'r')
    global mainRack
    g = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/MainRack.txt'),'r')
    mainRack = str(g.read())
    g.close()
    global stringRack2
    stringRack2 = f.read()
    global rackValues
    rackValues = 	{
	"A":    1,	
	"B":    3,	
    "C":    3,	
	"D":    2,	
    "E":	1,	
	"F":	4,	
	"G":    2,	
    "H":	4,	
	"I":	1,	
	"J":	8,	
	"K":	5,	
	"L":	1,	
	"M":	3,	
	"N":	1,	
	"O":	1,	
	"P":	3,	
	"Q":	10,	
	"R":	1,	
	"S":	1,	
	"T":    1,	
	"U":	1,	
	"V":    4,	
	"W":	4,	
	"X":	8,	
	"Y":	4,	
	"Z":	10	
	}
    f.close()

def laodDist():
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/dictionary.txt'),'r')
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
        if len(rack) < 7 and boardArray[row][x-len(word)-1]=='#':
            possArray.append(word)
            if id == 1:
                possStart.append([row,x-len(word),id])
            else:
                possStart.append([x-len(word),row,id])
        return

    if x > col and word in completion_dawg and x<15  and boardArray[row][x]=='#' and len(rack) < 7:
        if boardArray[row][x-len(word)-1]=='#':
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
                    if i+1<15 and boardArray[i+1][j]=='#':
                        checkWord("",i+1,x,j,stringRack2,id)
                    if i-1>=0 and boardArray[i-1][j]=='#' :
                        checkWord("",i-1,x,j,stringRack2,id)

def crossValue(row,col,id):        
    cost = 0
    if id == 1:
        k = row+1
        row-=1
        while row>=0 and boardArray[row][col] != '#':
            cost = cost + rackValues[boardArray[row][col]]
            row-=1

        while k<15 and boardArray[k][col] != '#':
            cost =  cost + rackValues[boardArray[k][col]] 
            k+=1

    if id == 2:
        k = col+1
        col-=1
        while col>=0 and boardArray[row][col] != '#':
            cost = cost + rackValues[boardArray[row][col]]
            col-=1

        while k<15 and boardArray[row][k] != '#':
            cost =  cost + rackValues[boardArray[row][k]] 
            k+=1
    return cost                    

def costFunc(strr,i,j,id):
    cost = 0
    dw = 0
    tw = 0
    cw = 0
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
            cw = cw + crossValue(i,col,id)
        cost = cost * (2 ** dw)
        cost = cost * (3 ** tw)
        cost = cost + cw

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
            cw = cw + crossValue(row,j,id)

        cost = cost * (2 ** dw)
        cost = cost * (3 ** tw)
        cost = cost + cw

    return cost

def move():
    getboard()
    global stringRack2
    global cRack
    getrack()
    stringRack2 = cRack
    getboardValue()
    
    global possArray
    possArray = []
    global possStart
    possStart = []

    laodDist()
    global boardArray
    if boardArray[7][7] == '#':
        for x in range(0,7):
            checkWord("",7,x,7,stringRack2,1)
    else :
        findPlace(1)
        boardArray = [*zip(*boardArray)]
        findPlace(2)
        
    mx = -1
    ansIndex = -1
    for i,strr in enumerate(possArray):
        if costFunc(strr,possStart[i][0],possStart[i][1],possStart[i][2]) > mx:
            mx = costFunc(strr,possStart[i][0],possStart[i][1],possStart[i][2])
            ansIndex = i
    
    if ansIndex == -1:
        global passcnt 
        if passcnt == 1:
            #print("END GAME")
            exit(0)
        else:
            #print("Changing Rack ")
             changeRack(0)
        return

    getboardCopy()
    
    if(possStart[ansIndex][2]==1):
        #print(" ---- HORIZONTLY ---- ")
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if i==possStart[ansIndex][0] and j >= possStart[ansIndex][1] and j<possStart[ansIndex][1]+len(possArray[ansIndex]):
                    f.write(possArray[ansIndex][j-possStart[ansIndex][1]])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')

    if(possStart[ansIndex][2]==2):
        #print(" ---- VERTICALLY---- ")
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if j==possStart[ansIndex][1] and i >= possStart[ansIndex][0] and i<possStart[ansIndex][0]+len(possArray[ansIndex]):
                    f.write(possArray[ansIndex][i-possStart[ansIndex][0]])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')
    
    global finalWord
    finalWord = possArray[ansIndex]
    #print("Best Posible String is " + possArray[ansIndex] + ". Starting is at row "+ str(possStart[ansIndex][0]+1)+" and col at " + str(possStart[ansIndex][1]+1)+" and point is "+str(mx))
    
    global cscore 
    cscore += mx
    #print(cscore)
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/pcscore.txt'),'w')
    f.write(str(cscore))
    f.close()

def userMove():
    getboard()
    global boardArray
    getboardCopy()
    
    d = input("Enter 1 for horizontal word\nEnter 2 for vertical word\n>")
    id = int(d)
    if id != 1 and id != 2:
        #print("select proper choice\n")
        return False
    word = input('enter your word\n>')
    word = word.upper()
    if not word in completion_dawg:
        #print("Word does not exist\n")
        return False
    ro = input('Enter row of your word starting point\n>')
    co = input('Enter column of your word starting point\n>')
    row = int(ro)
    col = int(co)
    x=row-1
    y=col-1
    nword=word
    global boardArray
    global userRack

    if id ==1:
        for i in range(0,len(word)-1):
            if not crossCheck(word[i],x,y+i):
                #print("Cross Check is not valid\n")
                return False

            j = userRack.find(word[i])
            if boardArray[x][y+i]!='#' and boardArray[x][y+i] != word[i]:
                #print("Wrong Placed word entered \n")
                return False
            elif boardArray[x][y+i]=='#':
                if j == -1:
                    #print("letter "+word[i]+" does not exist in rack \n")
                    return False
                elif j!=-1:
                    userRack = userRack[0:j] + userRack[j+1:]

    if id ==2:
        boardArray = [*zip(*boardArray)]
        for i in range(0,len(word)-1):
            if not crossCheck(word[i],y,x+i):
                #print("Cross Check is not valid\n")
                return False

        boardArray = [*zip(*boardArray)]
        for i in range(0,len(word)-1):    
            j = userRack.find(word[i])
            if boardArray[x+i][y]!='#' and boardArray[x+i][y] != word[i]:
                #print("Wrong Placed word entered \n")
                return False
            elif boardArray[x+i][y]=='#':
                if j == -1:
                    #print("letter "+word[i]+" does not exist in rack \n")
                    return False
                elif j!=-1:
                    userRack = userRack[0:j] + userRack[j+1:]
    
    global userScore 
    userScore += costFunc(word,row-1,col-1,id)

    getboardCopy()
    
    if(id==1):
        #print(" ---- HORIZONTLY ---- \nWord is :"+word+"\n")
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if i==row-1 and j >= col-1 and j<col-1+len(word):
                    f.write(word[j-col+1])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')
        
    if(id==2):
        #print(" ---- VERTICALLY---- \nWord is :"+word+"\n")
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/board.txt'),'w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if j==col-1 and i >= row-1 and i<row-1+len(word):
                    f.write(word[i-row+1])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')


def changeMainRack():
    global boardArray
    global boardArrayPrev
    global diffStr
    diffStr = ""
    for i,strr in enumerate(boardArray):
        for j,char in enumerate(strr):
        	# #print(boardArray[i][j],boardArrayPrev[i][j])
        	if boardArray[i][j] != boardArrayPrev[i][j]:
        		diffStr += boardArray[i][j]


def changeRack(which):
    if which%2==0:
        global cRack
        global diffStr
        getboard1()
        changeMainRack()
        global mainRack
        global flag 
        if mainRack=="":
            flag = True
            return
        ds = ""
        for i,ch in enumerate(diffStr):
            cRack = cRack.replace(ch,"",1)
        for i in range(len(cRack),7):
            dd = random.choice(mainRack)
            mainRack = mainRack.replace(dd,"",1)
            ds = ds + dd
        # print(diffStr)
        # print(ds)
        # print(mainRack)
        # print(cRack)
        cRack = cRack + ds
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/MainRack.txt'),'w')
        f.write(mainRack)
        f.close()
        f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/rack.txt'),'w')
        f.write(cRack)
        f.close()
    else:
        global userRack
        userRack = ""
        for i in range(0,2):
            userRack += random.choice(['A','E','I','O','U'])
        for i in range(2,7):
            userRack += random.choice(string.ascii_uppercase)

def passUser():
    global passcnt
    passcnt = 1

if __name__ == "__main__":
    # print(os.path.abspath(__file__))
    global flag 
    flag = False
    global passcnt
    passcnt = 0
    getboard()
    getrack()
    global cscore
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/pcscore.txt'),'r')
    cscore = int(f.read())
    f.close()
    global userScore
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/userscore.txt'),'r')
    userScore = int(f.read())
    f.close()
    global cRack
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/rack.txt'),'r')
    cRack = f.read()
    f.close()
    global userRack
    f = open(os.path.join(os.getcwd()+'./Players/'+sys.argv[1]+'/userrack.txt'),'r')
    userRack = f.read()
    f.close()
    changeRack(0)
    if flag == True:
        print("ERROR")
        exit(0)
    move()
    changeRack(0)
    print("D")