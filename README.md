We created our frontEnd using ReactJs , these are the most important components 
(files) that our website deeply logically relies on.
uploadFile.jsx
comparision.jsx
combineFiles.jsx
main.jsx

1)	uploadFile.jsx
Fundamental methods: 
export default function UploadFile()
explanation: This is a react function that enables the user to choose and upload a .xls file, in addition it allows the user to choose which file from the uploaded so the user can choose a graph type from 5 graphs and then to choose filters as well as x and y axis so the data from the uploaded xls file can be displayed visually 
1.Const handleFileSelect :the function handlefileSelect() 1is an event handler that processes files selected by the user in a file input field , it assures the right file format also. 
2.Const handleFileUpload: The handlefileupload function is an event handler designed to handle the file uploading
3. const deleteFile: enables the user to delete a desired file.
4. const generateChart = (), function that enables generating charts containing data
5. const renderChart = () : enables rendering chart according to the chart type


2)	comparision.jsx
Fundamental methods: 
           export default function Comparision()
explanation: This function allows the user to compare between various excel files by showing the shared columns between the various files, as well as showing the original tables ( files) it
it also allows the user to replace or remove a selected file.
1.	const processFile: this function proccess an uploaded excel file  and extracts its data.
2.	const onDrop: handle files dropped into a designated area of a web application. It processes the dropped files and updates the state accordingly.
3.	const sharedColumns: the sharedcolumns constant is a React usememo hook that computes and memoizes the list of column names shared across multiple Excel files
4.	const deleteFile: enables the user to delete files from the uploaded ones
5.	const replaceFile: enables the user to replace new files instead of the selected existing file.

3)	combineFiles.jsx
Fundamental methods:
1.function excelDateToJSDate(serial)
explanation: the exceldatetojsdate function converts an Excel serial date number into a JavaScript date object.
 	      2. function formatDate(date)
	      Explanation: The formatdate function formats a JavaScript date object into a    string with a dd/MM/yyyy HH:mm:ss format: 
    	     3. function CombineFiles()
	    Explanation: This function enables the user to drag and drop or upload excel files, shows the shared columns and enables the user to combine columns and data from various and different Files, after that it also allows the user to download the built up new table.
1.	const processExcelFile : The proccessexcelfile function is a callback function that processes an Excel file to extract and handle its data
2.	const onDrop: The ondrop function handles file uploads when files are dropped onto a specified area of the user interface. It processes the files, updates the application state, and manages errors.
3.	const handleColumnSelect: The handlecolumnselect function is used to manage the selection of columns from files. It updates the state to keep track of which columns have been selected
4.	const handleSharedColumnSelect: The handlesharedcolumnselect function manages the selection state of a column across multiple files. It toggles the selection of a column for all files in the columns object.
5.	const handleDeleteFile:handles the deletion process and updating the website state
6.	const handleReplaceFile: handles the replacement process and updates the website state accordingly
7.	const combinedData: The combinedata function, defined using usememo, processes the selected columns from different files and combines them into a single dataset.
8.	const previewData: The previewdata function, defined using usememo, is designed to process and prepare the combined data in order to put it in the preview section.
9.	const paginatedData: The paginateddata function, defined using the usememo hook, is used to create a subset of the previewdata based on the current pagination state
10.	const downloadFilteredExcel: The downloadfilteredexcel function is used to create and download an Excel file from the previewdata object

           4. main.jsx
	   Fundemental methods:
	   function setFavicon(url)
 	  explanation: The setfavicon function dynamically sets or changes the favicon of a webpage.
1.	const router: we set up a routing for the react application , We used React-router to manage switching between each page and maintaining a single-page application.


Tools Used that helped us coding : claude only.
The codes that claude provided are related to the charts and pages display, where it provided the necessary knowledge to make the pages stylish and logically valid, it didn’t help us in a concrete block of code, but snippets were taken from it here and there.
