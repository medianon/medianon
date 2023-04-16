<div>
    whenever you see lower case text, thats me talking to you. <br><br>
    what you are seeing right now is just a proof of concept. there are many things missing and something that shouldnt be here. <br>
    mainly google. this version of medianon uses firebase. <br>
    that means i am beholden to terms and conditions i didnt even read and im assuming have the clause 'we can delete your shit whenever and for whatever reason' in there. <br>
    step one after publishing this version will be adding keyboard shortcuts. <br>
    step two will be migrating to a firebase alternative asap. <br>
    step three will be self hosting medianon. <br>
    then we can carry on with the rest of the website in peace. <br><br>
    until then, please download a copy and speed up the process if you can. remember to open source it! thank you. <br><br><br><br>
    each '/boardname' costs at least 3 db reads including all live threads. <br>
    each '/b/thread' costs 2 reads including all replies in layer 1. <br>
    each '/b/t/post' costs 3 reads including all replies up to (current layer + 1). <br>
    making a board costs 1 db write. <br>
    making a thread costs at least 1 read and 2 writes. <br>
    replying to a thread costs 1 read and 3 writes. <br>
    replying to a reply costs 1 read and 4 writes. <br><br>
    100, 000 reads is $0.06 <br>
    100, 000 writes is $0.18 <br><br>
    this doesnt include deletes, queries and storage. <br>
    and all of that doesnt include server costs or food. <br><br>
    firebase provides: <br>
    50, 000 reads, 20, 000 writes, 20, 000 deletes per day and 1 gb storage for free. <br>
    full receipts will be put up on Patreon. <br><br>
    until i can self host everything, this is the reality. <br>
    please consider contributing however you can, if you can. <br><br>
    thank you for reading all of this.
</div>