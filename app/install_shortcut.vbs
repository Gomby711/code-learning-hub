' Creates a "Code Learning Hub" desktop shortcut pointing at this download's launch.vbs.
' Run this once after downloading/cloning the repo; double-click the resulting
' Desktop icon (or this file again any time) to (re)launch the app.
Option Explicit
Dim shell, fso, appDir, desktop, shortcut

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
appDir = fso.GetParentFolderName(WScript.ScriptFullName)
desktop = shell.SpecialFolders("Desktop")

Set shortcut = shell.CreateShortcut(desktop & "\Code Learning Hub.lnk")
shortcut.TargetPath = appDir & "\launch.vbs"
shortcut.WorkingDirectory = appDir
shortcut.IconLocation = appDir & "\icon.ico"
shortcut.Description = "Code Learning Hub"
shortcut.Save

MsgBox "Desktop shortcut created!" & vbCrLf & vbCrLf & _
  "Double-click ""Code Learning Hub"" on your Desktop to launch the app.", _
  vbInformation, "Code Learning Hub"
