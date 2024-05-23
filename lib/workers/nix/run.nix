{ pkgs }:
pkgs.writeShellScriptBin "run-server" ''
  ${pkgs.nodejs}/bin/node ${../server.js}
''
