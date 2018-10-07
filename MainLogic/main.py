import os
import dawg
from string import ascii_uppercase
import string
import random

def getboard():
    f =open('board.txt','r')
    stringboard = f.read()
    f.close()
    global boardArray
    boardArray = stringboard.split('\n')

def getboardCopy():
    f =open('board.txt','r')
    stringboard = f.read()
    f.close()
    global boardCopy
    boardCopy = stringboard.split('\n')


def getboardValue():
    f =open('boardValue.txt','r')
    stringboard = f.read()
    f.close()
    global boardValue
    boardValue = stringboard.split('\n')


def getrack():
    f=open('rack.txt','r')
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
            print("END GAME")
            exit(0)
        else:
            print("Changing Rack ")
            changeRack(0)
        return

    getboardCopy()
    
    if(possStart[ansIndex][2]==1):
        print(" ---- HORIZONTLY ---- ")
        f = open('board.txt','w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if i==possStart[ansIndex][0] and j >= possStart[ansIndex][1] and j<possStart[ansIndex][1]+len(possArray[ansIndex]):
                    f.write(possArray[ansIndex][j-possStart[ansIndex][1]])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')

    if(possStart[ansIndex][2]==2):
        print(" ---- VERTICALLY---- ")
        f = open('board.txt','w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if j==possStart[ansIndex][1] and i >= possStart[ansIndex][0] and i<possStart[ansIndex][0]+len(possArray[ansIndex]):
                    f.write(possArray[ansIndex][i-possStart[ansIndex][0]])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')

    print("Best Posible String is " + possArray[ansIndex] + ". Starting is at row "+ str(possStart[ansIndex][0]+1)+" and col at " + str(possStart[ansIndex][1]+1)+" and point is "+str(mx))
    
    global cscore 
    cscore += mx

def userMove():
    getboard()
    global boardArray
    getboardCopy()
    
    d = input("Enter 1 for horizontal word\nEnter 2 for vertical word\n>")
    id = int(d)
    if id != 1 and id != 2:
        print("select proper choice\n")
        return False
    word = input('enter your word\n>')
    word = word.upper()
    if not word in completion_dawg:
        print("Word does not exist\n")
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
                print("Cross Check is not valid\n")
                return False

            j = userRack.find(word[i])
            if boardArray[x][y+i]!='#' and boardArray[x][y+i] != word[i]:
                print("Wrong Placed word entered \n")
                return False
            elif boardArray[x][y+i]=='#':
                if j == -1:
                    print("letter "+word[i]+" does not exist in rack \n")
                    return False
                elif j!=-1:
                    userRack = userRack[0:j] + userRack[j+1:]

    if id ==2:
        boardArray = [*zip(*boardArray)]
        for i in range(0,len(word)-1):
            if not crossCheck(word[i],y,x+i):
                print("Cross Check is not valid\n")
                return False

        boardArray = [*zip(*boardArray)]
        for i in range(0,len(word)-1):    
            j = userRack.find(word[i])
            if boardArray[x+i][y]!='#' and boardArray[x+i][y] != word[i]:
                print("Wrong Placed word entered \n")
                return False
            elif boardArray[x+i][y]=='#':
                if j == -1:
                    print("letter "+word[i]+" does not exist in rack \n")
                    return False
                elif j!=-1:
                    userRack = userRack[0:j] + userRack[j+1:]
    
    global userScore 
    userScore += costFunc(word,row-1,col-1,id)

    getboardCopy()
    
    if(id==1):
        print(" ---- HORIZONTLY ---- \nWord is :"+word+"\n")
        f = open('board.txt','w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if i==row-1 and j >= col-1 and j<col-1+len(word):
                    f.write(word[j-col+1])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')
        
    if(id==2):
        print(" ---- VERTICALLY---- \nWord is :"+word+"\n")
        f = open('board.txt','w')
        for i,strr in enumerate(boardCopy):
            for j,char in enumerate(strr):
                if j==col-1 and i >= row-1 and i<row-1+len(word):
                    f.write(word[i-row+1])
                else :
                    f.write(strr[j])
            if i != len(boardCopy)-1: 
                f.write('\n')



def changeRack(which):
    if which%2==0:
        global cRack
        cRack = ""
        for i in range(0,2):
            cRack += random.choice(['A','E','I','O','U'])
        for i in range(2,7):
            cRack += random.choice(string.ascii_uppercase)
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
    f = open('board.txt','w')
    for i in range(0,15):
        if i==14:
            f.write("###############")
        else:
           f.write("###############\n")
    f.close()
    print("\n\n\n----------- ARE YOU READY TO LOSE ? ------------\n\n\n")
    userName = input('Please Enter Your Name: ')
    movecnt = 0
    global cscore
    cscore = 0
    global userScore
    userScore = 0
    global cRack
    global userRack
    changeRack(0)
    changeRack(1)
    while 1:
        print('\n---Current Board----\n')
        os.system('python printBoard.py')
        print("\n\n\nComputer Score : " + str(cscore) +"\t\t\t"+str(userName)+" Score :"+str(userScore)+"\n")
        print("Computer's Rack: "+cRack+"\t\t\t"+userName+"'s Rack: " + userRack+"\n\n\n")
        if movecnt%2==0:
            move()
            changeRack(movecnt)
            movecnt += 1
        else:
            userIn = input("1.) To Place Word \n2.) To Change Rack \n3.) To Pass \n4.) To Quit\n>")
            global passcnt
            if userIn == '1':
                if userMove() == False:
                    continue
                changeRack(movecnt)
                passcnt = 0
                movecnt += 1
            elif userIn == '2':
                changeRack(movecnt)
                passcnt = 0
                movecnt += 1
            elif userIn=='3':
                passUser()
                movecnt += 1
            elif userIn=='4':
                print("SEE!!!! Told You")
                exit(0)
            else :
                print("Please select valid choice \n>")