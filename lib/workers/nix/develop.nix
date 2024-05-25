{ pkgs }:
pkgs.mkShell {
  buildInputs = [ pkgs.nodejs pkgs.nodePackages.pnpm ];
}
