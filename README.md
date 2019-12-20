# README

Andalusian is a microservices management tool to create, update, deploy and invoke functions. Andalusian current supports Amazon Web Services, Google Cloud Platform and Microsoft Azure Cloud Computing Platform. Andalusian also supports containerization with Docker.

## Account Overview
In order to use the Account Overview page, the user must have configured one or more microservice platforms on Andalusian. Instructions on how to do so are outlined in the below sections.

The Account Overview page displays:
1. deployed GCloud functions within the selected project
2. deployed AWS functions within the selected region
3. deployed Azure functions within the selected project -----> JUSTIN TO EDIT THIS

Functions will only be displayed if the user has added GCloud, AWS, Azure configurations to authenticate user accounts with these cloud services.

## GCloud
### Configuration
User must have the following in order to use the service:
1. A project on the Google Cloud Platform,
2. Cloud Functions API enabled,
3. Cloud Resource Manager API enabled,
4. A key_file for the App Engine default service account.

### Landing Page
Upon signup to our service you are requested to enter your key_file. This is used to authorize you and allow us to deploy your functions on your behalf. The key will be saved for future use under the alias you give for it.

### Project's Functions
This portal will display all deployed AWS Lambda functions within the selected region.  
**Info** will display a number of properties of the function.  
**Invoke** will call the endpoint of that function.  
**Delete** will remove the function from your project.

### Create Function
To deploy a function, it needs:
1. **Function Name:** This needs to be the name of the function from the file you upload or the function you write.
2. **Runtime:** Choose the runtime you would like to use.
3. **Upload Function Files DropZone:** You can click or drag to upload your file to be deployed. It will then be displayed inside the field below. Alternatively, you can write your own function inside the field.
4. **Deploy:** After everything is filled out, this button will deploy your function. It can take up to 2 minutes to deploy.

## AWS
### Configuration
Upon logging in for the first time, the user will configure the account to authenticate with AWS. Each user can save multiple Access Key/Secret Access Key pairs. To do so, user will enter Access Key, Secret Access Key, and a Key Alias (a nickname for the pair). This information will get encripted before being saved in the database. AWS groups deployed functions by regions (us-east-1, us-east-2, etc). Selecting the appropriate region and clicking **Save Config** will create user's temporary credentials file for the session.

### My AWS Lambda Functions
This portal will display all deployed AWS Lambda functions within the selected region.
**Get Info** will display a number of properties of the function.
**Load Code** will populate the textbox on the page with the contents of the selected function file.
**Invoke** will invoke the function on AWS Lambda.
**Delete Function** will delete the function from AWS Lambda.

### Create Function
To deploy a function to AWS Lambda, the user will enter a function name, an AWS IAM role (a preconfigured IAM role with permissions to deploy Lambda function), select a runtime, and write the function code in the textbox. Once all four fields are entered, clicking the **Create Function** button will deploy to AWS Lambda. The function will be available immediately both on AWS Lambda and Andalusian consoles.

### Update Function
To update the code of a previously deployed function, the user will click on **Load Code** which will populate function name and function code field. Once the code is edited in the textbox, user will click on **Update Function** to update the deployed function.

## Azure
### Configuration
Upon logging in for the first time, the user will configure the account to authenticate with Azure. To do so, the user should enter their Azure Username, Password, and (if applicable) their Tenant ID. This information will get encrypted before being saved in the database. Clicking the Store Credentials Button will save this encrypted information in the database, and clicking the Log In Button will actually submit the stored credentials and log the user in to Microsoft Azure.

### My Azure Functions
This portal will display all deployed Microsoft Azure functionapps tied to the user's account.

### Create Project
To begin the process of deploying a function to your Azure functionapp, please enter a project name and select a runtime. Once both fields are entered, clicking the **Create Project** button will create all necessary boilerplate files in a directory associated with your account. This directory will be deleted upon logout as a security measure.

### Create Function
To create a function to deploy to your functionapp, please enter a name for the function and optionally select a template to use. Upon selection of the template, click the Create Function to create this function in your already created Project directory.

### Save Changes
Upon creation of the function, the selected template's code will load in a text display field. Feel free to edit this code as you wish, as any changes will be immediately reflected in the code to be deployed. After making any changes, click the Save Changes button to write those changes to the actual code files.

### Deploy Function
To finally deploy the newly created function to your functionapp, simply enter the name of your functionapp's resource group in the supplied input field and then click the Deploy button. Within seconds, the deployed function will be found with your functionapp in Microsoft Azure.

## Docker
### Configuration
If you are not already logged in through Docker Desktop you can log in by typing your Docker username and password at the top of the Docker page, then store them by clicking **Save Credentials**. These credentials will be stored securely. Click **Login** to connect to the Docker daemon.

You can create a custom Dockerfile from Andalusian interface by filling out the fields and clicking **Set Dockerfile** but it is recommended that you include a custom Dockerfile in your application if there are additional necessary steps beyond the fields supplied.

An Image/Container name is required. It must be lowercase and will be used to refer to the image under the hood going forward in the process.

### Build Image
Drag and drop the contents of the application folder you would like to create an image or container from in the specified drag and drop field. Only include the contents of the root folder, not the folder itself. If you are uploading with a custom Dockerfile, ensure the Dockerfile is on the top level of the application contents. Click **Setup Directory** to copy the directory to the application and then **Build Image** to create the Docker image.

### Containerize
To test your image you can click **Containerize**. This will run the image in a container on the localhost port 8888 where you can check to ensure the application is running properly. When you are finished running the container, click **Stop Container** to stop it. Once done deploying your image to either Docker Hub or AWS ECR click **Delete Images/Containers** to clear all images and containers on the system as well as clear the stored app cache.

### Docker Hub Deployment
Once you have a built image, paste your desired Docker Hub repository in the Docker Hub repository field and then click **Deploy to Docker Hub** to send it to the repository.

### AWS ECR Deployment
In order to connect to your ECR you must supply your AWS Access Key and Secret Access Key to the AWS Lambda tab prior to following the next steps. After you have done so and saved those credentials, paste your ECR Repository URI in the field provided. Click **Connect to ECR** to establish a secure connection to your default ECR instance then click **Push to AWS ECR** to push your image up to the repository. 

![alt-text](https://raw.githubusercontent.com/Andalusian/andalusian/master/andalusian_demo50.gif)
