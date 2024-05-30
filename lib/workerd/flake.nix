{
  description = "Hello World HTTP server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  # inputs.parent.url = "github:PorcoRosso85/nix_test";
  # inputs.parent.url = "../../";

  outputs =
    { self
    , nixpkgs
    , flake-utils
      # , parent 
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
      # parentOutPuts = parent.outputs;
    in
    {
      # nix develop
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.nodePackages.pnpm

          # # TODO 親リポジトリからflake持ってこれたら不要
          # pkgs.postgresql
          # pkgs.lazydocker

          pkgs.sqldef
          pkgs.sqlc
          pkgs.sqls
        ];
        shellHook = ''
          # Start postgresql
          # 現在のディレクトリ名を取得
          current_dir=$(basename "$PWD")
          # コンテナ名を設定
          container_name="postgres-$current_dir"
          # PostgreSQLのパスワードを設定 
          postgres_password="$current_dir"
          # Dockerコンテナを起動
          docker run --name "$container_name" -e POSTGRES_PASSWORD="$postgres_password" -d -p 5432:5432 postgres
          # 無事起動したかpsqlで確認し、確認ができたらpsqlを終了
          docker exec -it "$container_name" psql -U postgres -c "SELECT version();"
          
          # psqlでの接続用のエイリアスを設定
          echo 'alias psql="docker exec -it $container_name psql -U postgres"'
          
          # sqlsのサーバーを起動、ファイルを選択しつつ
          sqls -config ./sqls.yaml
        '';
        # inputsFrom = parentOutPuts.packages.${system};
      };

      # nix run
      packages = {
        cowsay = pkgs.cowsay;
      };

      apps = {
        # .#hello
        hello = flake-utils.lib.mkApp {
          drv = pkgs.hello;
        };
        # .#cowsay
        cowsay = flake-utils.lib.mkApp {
          drv = self.packages.${system}.cowsay;
        };
        hello2 = flake-utils.lib.mkApp {
          drv = pkgs.writeShellScriptBin "hello_from_shell" ''
            echo "Hello from shell!" 
          '';
        };
        test = flake-utils.lib.mkApp {
          drv = pkgs.writeShellScriptBin "test" ''
            cd ./database
            sqlc generate
            cd ..
            pnpm vitest ./database
          '';
        };
      };

    }
    );
}


