globals.ipProtect = ""

globals.server = {"db":"","pass":""}
globals.email = {"user":"","password":""}

title = function()
    clear_screen
    print("[NamelessOS Installer v1.00]")
    print("Welcome to NamelessOS Installer this will automatically compile the NamelessOS libraries."+char(10))
end function

pause = function()
    user_input("[Press any key to continue]",0,1)
end function

if not get_shell.host_computer.File("/sys/xorg.sys").has_permission("w") then
    title
    exit("Error: you must run this as root")
end if

title
pause

dbConf = function()
    title
    print("[Database Config]")
    ip = user_input("Enter server IP: ")
    pass = user_input("Enter server root password: ")
    print()
    connection = get_shell.connect_service(ip,22,"root",pass,"ssh")
    if connection then
        globals.server = {"db":ip,"pass":pass}
        return
    else
        print("Error: connection cannot be made on port 22")
        pause
        return dbConf
    end if
end function

emailConf = function()
    title
    print("[Email Config]")
    user = user_input("Enter email: ")
    pass = user_input("Enter email password: ")
    print()
    metamail = mail_login(user,pass)
    if typeof(metamail) != "string" then
        globals.email = {"user":user,"password":pass}
        return
    else
        print("Error: cannot login to email")
        pause
        return emailConf
    end if
end function

ipConf = function()
    title
    print("[Security]")
    print("Leave blank if you do not want your ip to be hidden (not recommended)")
    print("this will also hide your password when you login from your home ip encase your email gets compromised")
    globals.ipProtect = user_input("Enter an ip: ")
end function

dbConf
emailConf
ipConf

globals.ninit = ""
globals.nmain = ""
globals.nlib1 = ""

compConf = function()
    title
    comp = get_shell.host_computer
    print("[Compiling] (Enter File Path)")

    globals.ninit = user_input("Enter exact path to ninit: ")
    if not comp.File(globals.ninit) then
        print("Error: file not found")
        return compConf
    end if

    globals.nmain = user_input("Enter exact path to nmain: ")
    if not comp.File(globals.nmain) then
        print("Error: file not found")
        return compConf
    end if

    globals.nlib1 = user_input("Enter exact path to nlib1: ")
    if not comp.File(globals.nlib1) then
        print("Error: file not found")
        return compConf
    end if
end function

compConf

globals.fname = "namelessos"

fConf = function()
    title
    comp = get_shell.host_computer
    print("[Finish] (Enter File Path)")

    globals.fname = user_input("Enter name for NamelessOS: ")
end function

fConf

print(char(10))

comp = get_shell.host_computer
print("Installing...")

if comp.File("/etc/"+fname+".temp") then comp.File("/etc/"+fname+".temp").delete

comp.touch("/etc",fname+".temp")

temp = comp.File("/etc/"+fname+".temp")

pt1 = "globals.ipProtect="""+ipProtect+""";"
pt2 = "globals.server={""db"":"""+server.db+""",""pass"":"""+server.pass+"""};"
pt3 = "globals.email={""user"":"""+email.user+""",""password"":"""+email.password+"""};"
pt4 = "i"+"mport_code("""+ninit+""");"
pt5 = "i"+"mport_code("""+nlib1+""");"
pt6 = "i"+"mport_code("""+nmain+""");"

temp.set_content(pt1+pt2+pt3+pt4+pt5+pt6)

print(temp.get_content)

res = get_shell.build("/etc/"+globals.fname+".temp",current_path)

print("Installed")

print("Deleting temporary config file...")

temp.delete

print("Launching NamelessOS...")

get_shell.launch(current_path+"/"+fname)
