# How to install the self-signed SSL certificate

To debug the front-end Angular app, you need to install the SSL certificate from the *\src\PSTGI.Web.Host\ssl\* folder.
Follow these steps:

1. Start the mmc.exe application by pressing Win + R and typing mmc.exe.
1. Click on *File* > *Add/Remove Snap-in*.
1. Select *Certificates* and click *Add >*.
1. Select *Computer account* and click *Next >*.
1. Select *Local computer* and click *Finish*.
1. Click *OK*.
1. In the left pane, expand *Certificates (Local Computer)* > *Trusted Root Certification Authorities* > *Certificates*.
1. Right-click on the *Certificates* folder and select *All Tasks* > *Import...*.
1. Click *Next >*.
1. Browse to the *\src\PSTGI.Web.Host\ssl\* folder and select the *localhost.crt* file. Click *Next >*.
1. Select *Place all certificates in the following store* and click *Browse...*.
1. Select *Trusted Root Certification Authorities* and click *OK*.
1. Click *Next >* and then *Finish*. You will see a message box saying that the import was successful. Click *OK*.
1. Refresh the *Certificates* folder and you will see the *localhost* certificate in the list.

If you open the certificate, on the Certification Path tab, you will see "This certificate is OK".
To confirm the certificate is working, start the front-end app and navigate to [https://localhost:4200/](https://localhost:4200/). 
You will see the lock icon in the address bar.
