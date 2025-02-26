
**Setup:**

1.) Download server and client files

2.) Make a file called "wics-website" and place them in there

3.) Now you can open them on terminal (see backend)




**Set Up Github:**

1.) Start in wics-website server 

2.) git init

3.) git add .

4.) git commit -m "Enter what commiting"

5.) CONNECT REPO IF NEEDED (first time): git remote add origin (URL)

6.) git push -u origin master (master is branch name)

Errors sometimes: 
Sometimes I get:

To https://github.com/SophiaGreenwalt/WiCS-Website.git
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'https://github.com/SophiaGreenwalt/WiCS-Website.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

For that I do:

git pull --rebase origin master




**Set Up backend:**

1.) Go into terminal

2.) cd into wics-website and server

3.) npm init -y (server)

4.) npm install express mongoose dotenv jsonwebtoken bcrypt cors @sendgrid/mail (depenencies)







