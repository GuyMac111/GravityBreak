
Overview
=============
Gravity Break is a match-3 game, the objective of which is to break as many blocks as possible in 100 seconds.

Unlike other match 3 games however, the blocks are able to fall in 4 directions, depending on the positioning of the nearby planet. Changeable by the two buttons on the hud to the right.

To run
==============
Please host the entire file system inside of your local server. The node_modules directory (containing external dependencies) is excluded from the binary, and I expect that common Typescript practise would probably be to have this inside of /bin directory, or perhaps minified-in with the final js.

An assumption I made
==============
During the course of this challenge, I worked with the assumption that I was allowed to use 3rd-party open source libraries. Which is why you'll see a node_modules directory, featuring 2 modules:
"typescript-collections" - some basic collections
"requirejs" - a module loader, to reference the above inside of the final js.

4 Acknowledged code weaknesses
==============
1) The event system is not typed.
Given more time I would type the event system, to dispatch typed Event objects (instead of strings with pretty names) using generics. This way, future developers wouldn't have to guess the payload type inside of the components which are listening for the event, as the event object dispatched would contain a strongly typed payload, instead of 'message?:any'.

2) The GridStateController class.
I would love the chance to replace this with a 3rd-party state machine. 
It currently has far too much responsibility and I imagine very difficult to follow for anybody who did not write the code. 
Replace this class with something driven by an FSM and Task Sequences, and the implementation suddenly becomes extremely clean.

3) The game does not use Phaser's Texture Atlasing functionality. (Except for the BlockView object, which uses a spritesheet)
Again, this is something I didn't have time to implement due to the overhead of ramping-up my Typescript and Phaser abilities in order to complete the challenge. But texture atlasing is crucial for anything meant to run on mobile.

4) There is a sporadic NPE that can occur upon the first block swap attempt. 
I haven't been able to reproduce, but upon request, I can pour more effort into figuring this out in order to fix.

5) Please overlook the fact that the "Planet-shift" buttons are functionaly reversed.



