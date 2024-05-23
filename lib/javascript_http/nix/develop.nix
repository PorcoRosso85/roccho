{ pkgs }:
pkgs.mkShell {
  buildInputs = [ pkgs.nodejs ];
}
