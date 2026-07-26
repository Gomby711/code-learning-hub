' Code Learning Hub launcher.
' Runs the app as a real standalone desktop window (pywebview + WebView2) —
' no Chrome, no browser tabs, no address bar.
Option Explicit
Dim fso, shell, appDir, url, http, running

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
appDir = fso.GetParentFolderName(WScript.ScriptFullName)
url = "http://127.0.0.1:8899"

' If an instance is already running, don't start a second one.
running = False
On Error Resume Next
Set http = CreateObject("MSXML2.XMLHTTP")
http.Open "GET", url & "/api/courses", False
http.Send
If Err.Number = 0 And http.Status = 200 Then running = True
Err.Clear
On Error GoTo 0

If Not running Then
  shell.CurrentDirectory = appDir
  shell.Run "pythonw """ & appDir & "\server.py"" --window", 1, False
End If
